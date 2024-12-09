import Analytics from "../models/analytics-model.js";
import Url from "../models/url-model.js";
import shorthash from 'shorthash'
import { UAParser} from 'ua-parser-js'
import geoip from 'geoip-country'

const urlCtlr = {}

urlCtlr.create = async(req,res)=>{
    const body = req.body
    try{
        /* const checkUrl = await Url.findOne({user:req.currentUser.userId, longUrl : body.longUrl})
        if(checkUrl){
            return res.status(400).json({errors : 'you already created the shorturl for this long url'})
        } */
        let shortUrl = shorthash.unique(body.longUrl)
        body.shortUrl = `http://localhost:3300/api/${shortUrl}`
        body.user = req.currentUser.userId
        body.expireDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        const url = await Url.create(body)
        res.json(url.shortUrl)
    }catch(err){
        console.log(err)
        res.status(500).json({errors : 'something went wrong'})
    }
}

urlCtlr.show = async(req,res)=>{
    const id = req.params.id
    try{
        const url = await Url.findOne({_id: id, user:req.currentUser.userId})
        if(!url){
            return res.status(404).json({errors : 'url not found'})
        }
        const isExpired = url.expireDate < new Date()

        if(isExpired){
            return res.status(404).json({errors : 'url is expired'})
        }
        const analytics = await Analytics.findOne({_id : id})

        res.json({url : url, analytics : analytics})
    }catch(err){    
        res.status(500).json({errors : 'something went wrong'})
    }
}

urlCtlr.myurls = async(req,res)=>{
    try{
        const myurls = await Url.find({user : req.currentUser.userId})
        /* const checkedUrls = myurls.filter(ele=> ele.expireDate > new Date())
        if(!checkedUrls){
            return res.status(404).json({errors : 'no urls found'})
        }
        console.log(req.currentUser.userId) */
        res.json(myurls)
    }catch(err){
        console.log(err)
        res.status(500).json({errors : 'something went wrong'})
    }
}

urlCtlr.update = async(req,res)=>{
    const id = req.params.id
    const body = req.body
    try{
        const url = await Url.findOneAndUpdate({_id:id, user:req.currentUser.userId}, body, {new : true, runValidators : true})
        if(!url){
            return res.status(404).json({errors : 'url not found'})
        }
        res.json(url)
    }catch(err){
        res.status(400).json({errors : 'something went wrong'})
    }
}

urlCtlr.delete = async(req,res)=>{
    const id = req.params.id
    try{
        const url = await Url.findOneAndDelete({_id : id, user:req.currentUser.userId})
        if(!url){
            return res.status(404).json({errors : 'url not found'})
        }
        res.json(url)
    }catch(err){
        console.log(err)
        res.status(500).json({errors : 'something went wrong'})
    }
}

/* urlCtlr.redirect = async(req,res)=>{
    const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`User IP Address: ${userIp}`);

    const geoData = geoip.lookup(userIp);

    if (geoData) {
        console.log(`Country: ${geoData.country}`);
        console.log(`Country Code: ${geoData.countryCode}`);
    } else {
        console.log('Country not found for IP');
    }

    const { shortUrl } = req.params
    try{
        const urlData = await Url.findOne({shortUrl:shortUrl})
        const ip = req.ip
        console.log('ip:', ip)

        if(urlData){
            const urlAnalytics = await Analytics.findOne({_id : urlData._id})
            
            const userAgent = req.get('User-Agent');
                const parser = new UAParser(userAgent);
                const deviceType = parser.getDevice().type || 'desktop'; 
            
            if(urlAnalytics){
                
                let updateData = { $inc : { clicks : 1}}

                if(deviceType === 'desktop'){
                    updateData.$inc['devices.desktop'] = 1
                }else{
                    updateData.$inc['devices.mobile'] = 1
                }

                await Analytics.updateOne(
                    { _id : urlData._id },
                    updateData
                )

            }else{
                const newAnalytics = new Analytics({
                    _id: urlData._id,
                    clicks : 1,
                    devices : {
                        mobile : deviceType === 'mobile' ? 1 : 0,
                        desktop : deviceType === 'desktop' ? 1 : 0
                    }
                })
                await newAnalytics.save()
            }
            
            res.redirect(urlData.longUrl)
        }else{
            res.status(404).json('not found')
        }

    }catch(err){
        res.status(500).json({errors : 'something went wrong'})
    }
} */

    urlCtlr.redirect = async (req, res) => {
        
        const { shortUrl } = req.params;
        try {
            const urlData = await Url.findOne({ shortUrl: shortUrl });
            if (!urlData) {
                return res.status(404).json('URL not found');
            }
    
            const userAgent = req.get('User-Agent');
            const parser = new UAParser(userAgent);
            const deviceType = parser.getDevice().type || 'desktop';
    
            const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const isLocalhost = userIp === '::1' || userIp === '127.0.0.1'
            const geoData = isLocalhost ? { countries: 'India' } : geoip.lookup(userIp);
            const country = geoData?.country || 'India';
    
            const urlAnalytics = await Analytics.findOne({ _id: urlData._id });
    
            if (urlAnalytics) {
                const updateData = {
                    $inc: {
                        clicks: 1,
                        [`devices.${deviceType}`]: 1,
                        [`countries.${country}`]: 1,
                    }
                };


                await Analytics.updateOne(
                    { _id: urlData._id },
                     updateData);
                     
            } else {
                const initialCountryData = { [country]: 1 };
                const newAnalytics = new Analytics({
                    _id: urlData._id,
                    clicks: 1,
                    devices: {
                        mobile: deviceType === 'mobile' ? 1 : 0,
                        desktop: deviceType === 'desktop' ? 1 : 0,
                    },
                    countries: initialCountryData,
                });
                await newAnalytics.save();
            }
    
            //res.json({ longUrl: urlData.longUrl });
            res.redirect(urlData.longUrl)
        } catch (err) {
            console.error('Error while handling URL redirection:', err.message);
            res.status(500).json({ errors: 'Something went wrong' });
        }
    };
    

export default urlCtlr
