package com.tong.ossyy.user;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User,String> {
	//Hql语句查询
	@Query("select u from User u where u.username = ?1")
	public User findByLoginName(String username);

	//本地sql语句查询
	@Query(value="select * from t_book order by RAND() limit ?1",nativeQuery=true)
	public List<User> randomList(Integer n);

	//Hql语句查询
	@Query("select u from User u where u.id = ?1")
	public User findOne(int id);
}
