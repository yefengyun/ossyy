package com.tong.ossyy.util;

/**
 * 返回RESTjson数据格式封装类
 * 
 * @author Wofeiworenxing
 *
 * @param <T>
 *            需要返回数据类型
 */
public class ResultJson<T> {
	private int code;
	private String msg;
	private T data;


	public ResultJson() {
		super();
	}

	public ResultJson(T data) {
		super();
		this.data = data;
	}

	public ResultJson(ResultJson<Object> code) {
		super();
		this.code = code.code;
		this.msg = code.msg;
	}

	public ResultJson(int code, String msg) {
		super();
		this.code = code;
		this.msg = msg;
	}

	public ResultJson(ResultJson<Object> code, T data) {
		super();
		this.code = code.code;
		this.msg = code.msg;
		this.data = data;
		System.out.println(this.toString());
	}

	public ResultJson(int code, String msg, T data) {
		super();
		this.code = code;
		this.msg = msg;
		this.data = data;
	}

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}
	
	public void setStatus(ResultJson<Object>rj){
		setCode(rj.code); 
		setMsg(rj.msg);
	}
	
	@Override
	public String toString() {
		return "ResultJson [code=" + code + ", msg=" + msg + ", data=" + data + "]";
	}

}
