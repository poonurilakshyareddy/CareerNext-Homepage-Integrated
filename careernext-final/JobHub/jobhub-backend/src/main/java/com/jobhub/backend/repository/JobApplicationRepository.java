package com.jobhub.backend.repository;

import com.jobhub.backend.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {}
