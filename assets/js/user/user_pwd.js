$(function() {
    let form = layui.form

    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //判断 新/旧 密码是否以一致
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同~'
            }
        },
        //判断 新/确认的 密码是否以一致
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次输入的新密码不相同~'
            }
        }
    })

    // 重置密码表单提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败!')
                }
                layui.layer.msg(res.message)
                    // 重置表单数据为空
                $('.layui-form')[0].reset()
            }
        });


    });


})