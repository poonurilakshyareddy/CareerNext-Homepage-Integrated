package com.jobhub.backend.controller;

import com.jobhub.backend.model.Job;
import com.jobhub.backend.model.JobApplication;
import com.jobhub.backend.repository.JobApplicationRepository;
import com.jobhub.backend.repository.JobRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {
    private final JobApplicationRepository applications;
    private final JobRepository jobs;
    public ApplicationController(JobApplicationRepository applications, JobRepository jobs) { this.applications = applications; this.jobs = jobs; }
    @GetMapping public List<JobApplication> getApplications() { return applications.findAll(); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public JobApplication apply(@Valid @RequestBody ApplicationRequest request) {
        Job job = jobs.findById(request.jobId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
        JobApplication app = new JobApplication(); app.setApplicantName(request.applicantName()); app.setApplicantEmail(request.applicantEmail()); app.setJobId(job.getId()); app.setJobTitle(job.getTitle());
        return applications.save(app);
    }
    public record ApplicationRequest(@jakarta.validation.constraints.NotBlank String applicantName, @jakarta.validation.constraints.Email @jakarta.validation.constraints.NotBlank String applicantEmail, @jakarta.validation.constraints.NotNull Long jobId) {}
}
