package com.tong.ossyy.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

@Service
public class UserServiceImpl implements UserService{

	@Autowired
	UserRepository userMapper;
	
	@Override
	public void insertUser(User user) {
		user.setPassword(DigestUtils.md5DigestAsHex(user.getPassword().getBytes()));
		userMapper.save(user);
	}

	@Override
	public void deleteUser(String id) {
		userMapper.deleteById(id);
	}

	@Override
	public void updateUser(User user) {
		userMapper.save(user);
	}

	@Override
	public List<User> getUser() {
		return (List<User>) userMapper.findAll();
	}

	@Override
	public User getUserById(int id) {
		return (User) userMapper.findOne(id);
	}

	@Override
	public User getUserByLoginName(String loginname) {
		User user=userMapper.findByLoginName(loginname);
		return user;
	}



}
