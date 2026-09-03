package com.khiancarasicas.sunset.model.entity;

import com.khiancarasicas.sunset.model.enums.InterviewOutcome;
import com.khiancarasicas.sunset.model.enums.InterviewStatus;
import com.khiancarasicas.sunset.model.enums.InterviewType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "interviews")
@Getter
@Setter
@NoArgsConstructor
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_application_id", nullable = false)
    private JobApplication jobApplication;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewType type;

    @Column(nullable = false)
    private LocalDate date;

    private String time;

    private String interviewer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewStatus status;

    @Enumerated(EnumType.STRING)
    private InterviewOutcome outcome;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
