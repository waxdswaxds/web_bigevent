$(function() {

    let layer = layui.layer
    let form = layui.form



    innitArtCateList()
        //获取文章分类列表
    function innitArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // console.log(res);
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        });
    }

    //为添加类别按钮绑定点击事件
    let indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });

    //通过代理的形式，为 form-add 绑定表单 submit 事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                // console.log('ok');
                if (res.status !== 0) {
                    return layer.msg('添加图书失败')
                }
                layer.msg('添加图书成功')
                innitArtCateList()
                    //根据索引关闭弹出层
                layer.close(indexAdd)
            }
        });
    })

    //通过代理的形式，为 btn-edit绑定 点击 事件
    let indexEdit = null
    $('tbody').on('click', '#btn-edit', function() {
        // console.log('ok');
        // 弹出一个修改文章分类的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: 'x修改文章分类',
            content: $('#dialog-edit').html()
        });

        let id = $(this).attr('data-id')
        console.log(id);
        // 发起请求获取对应的分类数据
        $.ajax({
            method: "GET",
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res.data);
                form.val('form-edit', res.data)
            }
        });
    })

    // 通过代理形式为修改表单事件提交 submit 事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                }
                layer.msg('更新分类数据成功')
                layer.close(indexEdit)
                innitArtCateList()
            }
        });
    });


    // 通过代理形式为删除按钮绑定点击事件

    $('body').on('click', '#btn-delete', function() {
        let id = $(this).attr('data-id')
        console.log(id);
        //提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                type: "GET",
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index);
                    innitArtCateList()

                }
            });
        });
    })

})