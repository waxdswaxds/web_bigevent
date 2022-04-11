// 注意：每次调用$.get 或 $.post 或 $.ajax 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给的Ajax提供的配置对象



$.ajaxPrefilter(function(options) {
    // console.log(options.url);
    // 发起真正的Ajax请求之前,统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url

    //统一为有权限的接口，设置 headers 请求头

    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            authorization: localStorage.getItem('token') || ''
        }
    }


    // console.log(options.url);

    //全局统一挂载 complete 回调函数
    options.complete = function(res) {
        // console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
})