package com.jobhub.backend;

import com.jobhub.backend.model.Job;
import com.jobhub.backend.repository.JobRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JobDataInitializer {
    @Bean CommandLineRunner seedJobs(JobRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Job("Java Developer Intern", "TechNova Solutions", "Hyderabad, Telangana", "Internship", "Hybrid", "₹12,000–₹18,000/mo", "Engineering", "Work with Java, Spring Boot and REST APIs alongside an experienced engineering team."));
                repository.save(new Job("Frontend Developer", "PixelCraft Studio", "Remote, India", "Full-time", "Remote", "₹4–6 LPA", "Design & Development", "Build responsive user experiences with React, JavaScript, CSS and modern frontend tools."));
                repository.save(new Job("Graduate Software Engineer", "CloudSpring", "Bengaluru, Karnataka", "Full-time", "On-site", "₹6–8 LPA", "Engineering", "Join a collaborative team building reliable cloud-based products and services."));
                repository.save(new Job("Data Analyst Intern", "InsightWorks", "Remote, India", "Internship", "Remote", "₹10,000–₹15,000/mo", "Data & Analytics", "Help transform data into insights using spreadsheets, SQL and visual dashboards."));
            }
        };
    }
}
