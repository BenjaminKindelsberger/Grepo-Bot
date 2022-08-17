const axios = require('axios').default;

function parseCookies(setCookies){
    const cookies ={};

    for(const cookie of setCookies){
        const pair = cookie.split(';')[0].split('=');
        cookies[pair[0]] = pair[1];
    }
    return cookies;

}
function cookieToString(cookies){
    let cookieString ='';
    for(const [key,value] of Object.entries(cookies) ){
        cookieString += `${key}=${value}; `;
    }

    return cookieString;

}

function setCookies(session,oldCookies, setCookiesHeader){
    const cookies = {
        ...oldCookies,
        ...parseCookies(setCookiesHeader),
    }

    session.defaults.headers['cookie'] = cookieToString(cookies);

    return cookies;


}

async function main(){

    const session = axios.create();
    session.defaults.withCredentials = true;
    session.defaults.headers['user-agent'] = 'Chrome/104.0.0.0';

    const res = await session.get('https://en.grepolis.com/'); 
    let cookies ={}
    cookies = setCookies(session,cookies, res.headers['set-cookie']);


    session.defaults.headers['x-requested-with'] = 'XMLHttpRequest';
    session.defaults.headers['x-resf-token'] = cookies['XSRF-TOKEN'];
    const loginCheckUrl = 'https://en.grepolis.com/glps/login_check';

    const username ="testacc";
    const password ="test123";
    const data= `login%5Buserid%5D=${username}&login%5Bpassword%5D=${password}&login%5Bremember_me%5D=true'`;

    
    const check = await session.post(loginCheckUrl, data);
    console.log(check.headers);
}

main();