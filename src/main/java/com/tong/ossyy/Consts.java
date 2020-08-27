package com.tong.ossyy;

import com.tong.ossyy.util.ResultJson;

/**
 * 常量类
 * 
 * @author Administrator
 *
 */
public class Consts {
	/********************** 验证码常量配置 **************************/
	public static final String VERIFY_CODES = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // 验证码字符集
	public static final int VERIFY_SIZE = 4; // 验证码字符长度
	public static final int VERIFY_WIDTH = 200; // 验证码图像宽度
	public static final int VERIFY_HEIGHT = 80; // 验证码图像高度
	public static final String VERIFY_SESSIONKEY = "verifycode"; // 验证码图像高度

	/********************** json返回类型 **************************/
	public static final ResultJson<Object> SUCCSS_RESULT = new ResultJson<Object>(0, "操作成功");
	public static final ResultJson<Object> SYSTEM_ERROR_RESULT = new ResultJson<Object>(1, "系统异常，请稍后重试");
	public static final ResultJson<Object> LOGIN_ERROR_RESULT = new ResultJson<Object>(2, "登录信息已失效，请重新登录");
	public static final ResultJson<Object> PARAM_ERROR_RESULT = new ResultJson<Object>(3, "请求参数异常，请重试");
	public static final ResultJson<Object> FAIL_RESULT = new ResultJson<Object>(4, "操作失败，请重试");

	/********************** 对象和个体 ****************************/
	// 时间 缓存时间
	public static final String LOGINKEY = "LOGINNAME";
	public static final int TIMEOUT = 1800;// 秒
	public static final String ON_LOGIN = "/ossyy";
	public static final String LOGIN_OUT = "/logout";
	// 不验证URL anon：不验证/authc：受控制的
	public static final String NO_INTERCEPTOR_PATH = ".*/((.css)|(.js)|(images)|(login)|(logout)).*";

}
