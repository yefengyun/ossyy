package com.tong.ossyy.user;

import java.io.Serializable;
import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

/**
 * @author Administrator
 *
 */
@Entity
public class User implements Serializable{
    /**
	 * 
	 */
	private static final long serialVersionUID = 2324592759233328110L;

	@Id
    @Column(name = "id")
    private int id;
 
    @Column(name = "password")
    private String password;

    @Column(name = "last_login")
	private Date lastlogin;

    @Column(name = "is_superuser")
    private int superuser;

    @Column(name = "username")
    private String username;

    @Column(name = "first_name")
    private String firstname;

    @Column(name = "last_name")
    private String lastname;

    @Column(name = "email")
    private String email;
    
    @Column(name = "is_staff")
    private int staff;
    
    @Column(name = "is_active")
    private int active;
    
    @Column(name = "date_joined")
    private Date datejoined;
    
    @Column(name = "phone")
    private String phone;
    
    @Column(name = "role_id")
    private String roleid;

	public User() {
		super();
		// TODO Auto-generated constructor stub
	}

	public User(int id, String password, Date lastlogin, int superuser, String username, String firstname,
			String lastname, String email, int staff, int active, Date datejoined, String phone, String roleid) {
		super();
		this.id = id;
		this.password = password;
		this.lastlogin = lastlogin;
		this.superuser = superuser;
		this.username = username;
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.staff = staff;
		this.active = active;
		this.datejoined = datejoined;
		this.phone = phone;
		this.roleid = roleid;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Date getLastlogin() {
		return lastlogin;
	}

	public void setLastlogin(Date lastlogin) {
		this.lastlogin = lastlogin;
	}

	public int getSuperuser() {
		return superuser;
	}

	public void setSuperuser(int superuser) {
		this.superuser = superuser;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getFirstname() {
		return firstname;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public int getStaff() {
		return staff;
	}

	public void setStaff(int staff) {
		this.staff = staff;
	}

	public int getActive() {
		return active;
	}

	public void setActive(int active) {
		this.active = active;
	}

	public Date getDatejoined() {
		return datejoined;
	}

	public void setDatejoined(Date datejoined) {
		this.datejoined = datejoined;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getRoleid() {
		return roleid;
	}

	public void setRoleid(String roleid) {
		this.roleid = roleid;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", password=" + password + ", lastlogin=" + lastlogin + ", superuser=" + superuser
				+ ", username=" + username + ", firstname=" + firstname + ", lastname=" + lastname + ", email=" + email
				+ ", staff=" + staff + ", active=" + active + ", datejoined=" + datejoined + ", phone=" + phone
				+ ", roleid=" + roleid + "]";
	}
    
	
    
}
