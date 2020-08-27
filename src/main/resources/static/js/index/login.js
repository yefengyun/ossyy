layui.config({
  base: '/static/layuiadmin/' //静态资源所在路径
}).extend({
  index: 'lib/index' //主入口模块
}).use(['index', 'user','form'], function(){
  var $ = layui.$
  ,setter = layui.setter
  ,admin = layui.admin
  ,form = layui.form
  ,router = layui.router()
  ,search = router.search;
  form.render();
   $(document).ready(function () {
      if (window != top) {
          top.location.href = location.href;
      }
  });
  //提交
  form.on('submit(LAY-user-login-submit)', function(obj){
    //请求登入接口
    $.post({
      url:'/login/',
      data:obj.field,
      success:function(res){
         if (res.code == "0") {
            layer.msg('登入成功', {
              offset: '15px',
              icon: 1,
              time: 1000
            }, function () {
              location.href = '/manager/'
            });
          } else {
            layer.msg(res.data.msg, {
              offset: '15px',
              icon: 2,
              time: 10000
            })
            $("#LAY-user-get-vercode").click();
          }
      },
  });
  return false;
  });

  //绑定enter键
  $(document).keyup(function (e) {
      var _keyCode = e.keyCode || e.which;
      if ('13' == _keyCode) {
        $("#login").click();
      }
    });

});