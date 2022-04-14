$(function() {

    let layer = layui.layer
    let form = layui.form


    initCate()

    // 初始化富文本编辑器
    initEditor()






    //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            data: "data",
            success: function(res) {
                // console.log('ok');
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                // 调用模板引擎,渲染分类分下拉菜单
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 一定要调用 form render函数
                form.render()
            }
        });
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮,绑定事件处理函数
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    // 监听 coverFile 的change 事件,获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        //获取到文件的列表数组
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        //根据文件创建对应的 URL 地址
        let newImageURL = URL.createObjectURL(files[0])
            //为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImageURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    // 定义发布文章的状态
    let art_state = '已发布'
        // 为存为草稿按钮,绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿'

    })



    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function(e) {
        // 1.
        e.preventDefault()
            // 2.基于form表单,快速创建一个 formData 对象/
        let fd = new FormData($(this)[0])
            // 3.将文章的发布状态存到 fd 中
        fd.append('state', art_state)
            // fd.forEach(function(v, k) {
            //     console.log(k, v);
            // })
            // 4.将封面裁剪过后的图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将文件对象存储 fd 中
                fd.append('cover_img', blob)
                    // 6.发起 Ajax 请求
                publishArticle(fd)
            })
    })


    //定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            // 如果向服务器提交的是 formData 格式数据
            // 必须配置以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布失败!')
                }
                layer.msg('发布成功!')
                    //发布成功后跳转到文章列表页
                location.href = '/article/art_list.html'
            }
        });
    }

})