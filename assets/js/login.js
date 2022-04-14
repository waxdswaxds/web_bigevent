$(function() {
    // 点击去注册账号的链接
    $('#link_reg').on('click', function() {
            $('.login-box').hide()
            $('.reg-box').show();
        })
        // 点击去登录账号的链接
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide();
    })

    // 从 layui 中获取 Form对象
    var form = layui.form
        // 从 layui 中获取 layer对象
    var larer = layui.larer
        // 通过 form.verify()函数自定义效验规则
    form.verify({
        pwd: [ //自定义了一个 pwd 的效验规则
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 效验两次是否一致
        ewpwd: function(value) {
            // console.log(value);
            var pwd = $('.reg-box [name=password]').val()
            if (value !== pwd) return '两次密码不一致！'
        }
    })

    let data = {
        username: $('#form-reg [name=username]').val(),
        password: $('#form-reg [name=password]').val(),
    }
    let url = ''


    // 监听注册表单提交事件
    $('#form-reg').on('submit', function(e) {
            // 阻止默认提交行为
            e.preventDefault();
            // 发起 ajax post 请求
            $.post('/api/reguser', data,
                function(res) {
                    if (res.status !== 0) {
                        return layer.msg('注册失败');;
                    }
                    layer.msg('注册成功');
                    $('#link_login').click()
                })
        })
        // 监听登录表单提交事件


    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: "/api/login",
            method: 'post',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功');
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token)
                location.href = '/index.html'

            },

        })
    })





    // 
})