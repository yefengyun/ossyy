package com.tong.ossyy.user;

import java.util.List;

public interface UserService {
	/**
     * 添加
     */
    void insertUser(User user);
 
    /**
     * 删除
     */
    void deleteUser(String id);
 
    /**
     * 修改
     */
    void updateUser(User user);
 
    /**
     * 查询
     */
     List<User> getUser();
 
    /**
     * 按id查询单个
     */
    User getUserById(int id);
    
    /**
     * 按loginname单个
     */
    User getUserByLoginName(String loginname);

 
}
