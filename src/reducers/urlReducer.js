export default function urlReducer(state,action){
    switch(action.type){
        case "my_urls" :{
            return {...state, ...action.payload}
        }
        case 'delete_url' : {
            return {...state, 
                myurls : state.myurls.filter(ele=> ele._id !== action.payload)
            }
        }
        case 'get_url_analytics' : {
            return {...state,
                analytics : action.payload
            }
        }
        case 'update_url' : {
            return {...state,
                myurls: state.myurls.map(url=> url._id === action.payload._id ? action.payload : url)
            }
        }
        default :{
            return {...state}
        }
    }
    
}