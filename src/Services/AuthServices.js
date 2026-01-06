import axios from "axios"


///////////////////  signup
export async function  sendRegister(userData){
  try{
      let {data} = await axios.post(`https://fakestoreapi.com/users`, userData)
    console.log(data)
    return data
     }catch(err){
        
        return err.response.data.error
  
    }
}

 //////////////////   signin
export async function sendLogin(userData) {
  console.log('=== sendLogin called ===');
  console.log('Received userData:', userData);
  
  try {
    // FakeStoreAPI بيانات الاختبار المعروفة
    const loginData = {
      username: userData.username || 'johnd', // استخدم johnd كقيمة افتراضية
      password: userData.password || 'm38rmF$'
    };
    
    console.log('Sending to API:', loginData);
    
    const response = await axios.post(`https://fakestoreapi.com/auth/login`, loginData);
    console.log('API Success! Response:', response.data);
    
    // رجع البيانات
    return response.data;
    
  } catch (err) {
    console.log('=== API Error Details ===');
    console.log('Error:', err);
    console.log('Response data:', err.response?.data);
    console.log('Status:', err.response?.status);
    
    // رجع error object بدلاً من string
    return { 
      error: err.response?.data || 'Login failed. Please try again.'
    };
  }
}
  