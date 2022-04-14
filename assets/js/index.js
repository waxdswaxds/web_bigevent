$(function() {




    getUserInfo()

    let layer = layui.layer

    $('#btnLogout').on('click', function() {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 1.清空本地存储中的token
            localStorage.removeItem('token')
                //重新跳转到登录页面
            location.href = '/login.html'
                //关闭 confirm 询问框
            layer.close(index);
        });

    })
})

//获取用户的基本信息
function getUserInfo() {

    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        data: "data",
        //headers 就是请求头配置对象
        headers: {
            authorization: localStorage.getItem('token') || ''
        },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // console.log(res);

            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)

        },
        // 不论成功还是失败，最终都会调用 complete 回调函数
        // complete: function(res) {
        //     // console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         localStorage.removeItem('token')
        //         location.href = '/login.html'
        //     }
        // }
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    //1.获取用户的昵称
    let name = user.nickname || user.username
        // 2.设置文本内容
    $('#welcome').html('欢迎&nbsp;' + name)
        // 按需渲染用户的的头像
    if (user.user_pic !== null) {
        //渲染图片头像
        $('.layui-nav-img').attr("src", user.user_pic).show()
        $('.text-avatar').hide(1)
    } else {
        //文本头像
        let first = name[0].toUpperCase()
            // console.log(first);
        $('.text-avatar').html(first).show()
        $('.layui-nav-img').hide(1)

    }
}