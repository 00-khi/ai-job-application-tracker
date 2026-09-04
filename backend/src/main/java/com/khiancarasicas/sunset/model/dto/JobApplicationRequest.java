package com.khiancarasicas.sunset.model.dto;

import com.khiancarasicas.sunset.model.enums.ApplicationStatus;
import com.khiancarasicas.sunset.model.enums.JobType;
import com.khiancarasicas.sunset.model.enums.WorkMode;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class JobApplicationRequest {

    @NotBlank(message = "Company is required")
    private String company;

    @NotBlank(message = "Title is required")
    private String title;

    private String location;

    private WorkMode workMode;

    private JobType jobType;

    private Integer salaryMin;

    private Integer salaryMax;

    private String currency;

    private ApplicationStatus status;

    private LocalDate dateApplied;

    private String source;

    private String contactName;

    private String contactEmail;

    private String jobUrl;

    private String notes;

    private List<String> tags;
}
