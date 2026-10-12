package com.jobhub.backend.controller;

import com.jobhub.backend.model.Job;
import com.jobhub.backend.repository.JobRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class JobController {
    private final JobRepository jobs;
    public JobController(JobRepository jobs) { this.jobs = jobs; }

    @GetMapping
    public List<Job> getJobs(@RequestParam(required = false) String search) {
        if (search == null || search.isBlank()) return jobs.findAll();
        return jobs.findByTitleContainingIgnoreCaseOrCompanyContainingIgnoreCaseOrLocationContainingIgnoreCase(search, search, search);
    }
    @GetMapping("/{id}")
    public Job getJob(@PathVariable Long id) {
        return jobs.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
    }
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Job createJob(@Valid @RequestBody Job job) { return jobs.save(job); }
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteJob(@PathVariable Long id) { jobs.deleteById(id); }
}
