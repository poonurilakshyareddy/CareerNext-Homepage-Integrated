package com.jobhub.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "jobs")
public class Job {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank private String title;
    @NotBlank private String company;
    @NotBlank private String location;
    private String type = "Full-time";
    private String mode = "On-site";
    private String salary = "Salary not listed";
    private String category = "Engineering";
    @Column(length = 2000) private String description;

    public Job() {}
    public Job(String title, String company, String location, String type, String mode, String salary, String category, String description) {
        this.title = title; this.company = company; this.location = location; this.type = type; this.mode = mode; this.salary = salary; this.category = category; this.description = description;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public String getSalary() { return salary; }
    public void setSalary(String salary) { this.salary = salary; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
