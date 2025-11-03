package com.medexjob.repository;

import com.medexjob.entity.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, UUID> {

    // Find applications by job
    Page<Application> findByJobId(UUID jobId, Pageable pageable);

    // Find applications by candidate
    Page<Application> findByCandidate_Id(UUID candidateId, Pageable pageable);

    // Find applications by status
    Page<Application> findByStatus(Application.ApplicationStatus status, Pageable pageable);

    // Find applications by job and status
    Page<Application> findByJobIdAndStatus(UUID jobId, Application.ApplicationStatus status, Pageable pageable);
    
    // Find applications by candidate and status
    Page<Application> findByCandidate_IdAndStatus(UUID candidateId, Application.ApplicationStatus status, Pageable pageable);

    // Count applications by job
    long countByJobId(UUID jobId);

    // Count applications by status
    long countByStatus(Application.ApplicationStatus status);

    // Count applications by job and status
    long countByJobIdAndStatus(UUID jobId, Application.ApplicationStatus status);

    // Find applications with job details for admin view
    @Query("SELECT a FROM Application a JOIN FETCH a.job WHERE a.job.id = :jobId")
    List<Application> findByJobIdWithJobDetails(@Param("jobId") UUID jobId);

    // Search applications by candidate name or email
    @Query("SELECT a FROM Application a WHERE " +
           "LOWER(a.candidateName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.candidateEmail) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Application> searchApplications(@Param("keyword") String keyword, Pageable pageable);    

    // Find applications by candidate's email through User relationship
    Page<Application> findByCandidate_Email(String email, Pageable pageable);
    
    // Find applications by candidateEmail field directly with JOIN FETCH
    @Query("SELECT a FROM Application a JOIN FETCH a.job j LEFT JOIN FETCH j.employer WHERE a.candidateEmail = :email")
    Page<Application> findByCandidateEmail(@Param("email") String email, Pageable pageable);
    
    // Find all applications with JOIN FETCH for admin view
    @Query("SELECT a FROM Application a JOIN FETCH a.job j LEFT JOIN FETCH j.employer LEFT JOIN FETCH a.candidate")
    Page<Application> findAllWithDetails(Pageable pageable);
    
    // Find applications by job with JOIN FETCH
    @Query("SELECT a FROM Application a JOIN FETCH a.job j LEFT JOIN FETCH j.employer LEFT JOIN FETCH a.candidate WHERE a.job.id = :jobId")
    Page<Application> findByJobIdWithDetails(@Param("jobId") UUID jobId, Pageable pageable);
    
    // Find applications by status with JOIN FETCH
    @Query("SELECT a FROM Application a JOIN FETCH a.job j LEFT JOIN FETCH j.employer LEFT JOIN FETCH a.candidate WHERE a.status = :status")
    Page<Application> findByStatusWithDetails(@Param("status") Application.ApplicationStatus status, Pageable pageable);
    
    // Find applications by job and status with JOIN FETCH
    @Query("SELECT a FROM Application a JOIN FETCH a.job j LEFT JOIN FETCH j.employer LEFT JOIN FETCH a.candidate WHERE a.job.id = :jobId AND a.status = :status")
    Page<Application> findByJobIdAndStatusWithDetails(@Param("jobId") UUID jobId, @Param("status") Application.ApplicationStatus status, Pageable pageable);
    
    // Find applications by candidate with JOIN FETCH
    @Query("SELECT a FROM Application a JOIN FETCH a.job j LEFT JOIN FETCH j.employer LEFT JOIN FETCH a.candidate WHERE a.candidate.id = :candidateId")
    Page<Application> findByCandidateIdWithDetails(@Param("candidateId") UUID candidateId, Pageable pageable);
    
    // Find applications by candidate and status with JOIN FETCH
    @Query("SELECT a FROM Application a JOIN FETCH a.job j LEFT JOIN FETCH j.employer LEFT JOIN FETCH a.candidate WHERE a.candidate.id = :candidateId AND a.status = :status")
    Page<Application> findByCandidateIdAndStatusWithDetails(@Param("candidateId") UUID candidateId, @Param("status") Application.ApplicationStatus status, Pageable pageable);
    
    // Search applications with JOIN FETCH
    @Query("SELECT a FROM Application a JOIN FETCH a.job j LEFT JOIN FETCH j.employer LEFT JOIN FETCH a.candidate WHERE " +
           "LOWER(a.candidateName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.candidateEmail) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Application> searchApplicationsWithDetails(@Param("keyword") String keyword, Pageable pageable);
}
