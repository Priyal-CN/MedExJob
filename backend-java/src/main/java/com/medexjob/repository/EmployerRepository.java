package com.medexjob.repository;

import com.medexjob.entity.Employer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.Optional;

@Repository
public interface EmployerRepository extends JpaRepository<Employer, UUID> {
    Optional<Employer> findByCompanyName(String companyName);
    
    @Query("SELECT e FROM Employer e JOIN FETCH e.user")
    Page<Employer> findAllWithUser(Pageable pageable);
    
    @Query("SELECT e FROM Employer e JOIN FETCH e.user WHERE e.verificationStatus = :status")
    Page<Employer> findAllWithUserByVerificationStatus(Employer.VerificationStatus status, Pageable pageable);
    
    long countByVerificationStatus(Employer.VerificationStatus status);
}
