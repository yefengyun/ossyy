package com.tong.ossyy.interceptor;

import java.lang.reflect.Method;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.tong.ossyy.Consts;

public class AuthInterceptor implements HandlerInterceptor {

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object obj, Exception exc)
			throws Exception {
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object obj, ModelAndView arg3)
			throws Exception {
	}

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		// 如果不是映射到方法直接通过
		if (!(handler instanceof HandlerMethod)) {
			return true;
		}
		// ①:START 方法注解级拦截器
		HandlerMethod handlerMethod = (HandlerMethod) handler;
		Method method = handlerMethod.getMethod();
		// 判断接口是否需要登录
		LoginRequired methodAnnotation = method.getAnnotation(LoginRequired.class);
		// 有 @LoginRequired 注解，需要认证
		if (methodAnnotation != null) {
			// 这写你拦截需要干的事儿，比如取缓存，SESSION，权限判断等
			System.out.println("====================================");
			HttpSession session = request.getSession();
			System.out.println(session.getAttribute(Consts.LOGINKEY));
			if (session.getAttribute(Consts.LOGINKEY) != null) {
				return true;
			}
			request.setAttribute("msg", "无权限请先登录");
			// 获取request返回页面到登录页
			request.getRequestDispatcher("/").forward(request, response);

			return false;
		}
		return true;
	}

}
