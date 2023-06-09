package com.supermarket.controller;

import com.supermarket.model.Check;
import com.supermarket.repository.EntityRepositories.CheckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api")
public class CheckController {
    @Autowired
    CheckRepository checkRepository;

    @GetMapping("/checks")
    public ResponseEntity<List<Check>> getAllChecks(@RequestParam(required = false) LocalDateTime startDate,
                                                    @RequestParam(required = false) LocalDateTime endDate,
                                                    @RequestParam(required = false) String cashierId) {
        List<Check> checks;
        try {
            if(startDate != null && endDate != null && cashierId != null)
                checks = checkRepository.findAllPrintedByCashierWithinTimePeriod(cashierId, startDate, endDate);
            else if(startDate != null && endDate != null)
                checks = checkRepository.findAllPrintedWithinTimePeriod(startDate, endDate);
            else
                checks = checkRepository.findAll();

            if (checks.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            return new ResponseEntity<>(checks, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/checks-sum")
    public ResponseEntity<Double> getChecksSum(@RequestParam LocalDateTime startDate,
                                               @RequestParam LocalDateTime endDate,
                                               @RequestParam(required = false) String cashierId) {
        double sum;
        try {
            if(cashierId != null)
                sum = checkRepository.getTotalSumOfProductsSoldByCashierForTimePeriod(cashierId, startDate, endDate);
            else
                sum = checkRepository.getTotalSumOfProductsSoldForTimePeriod(startDate, endDate);

            return new ResponseEntity<>(sum, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/checks/{id}")
    public ResponseEntity<Check> getCheckById(@PathVariable("id") String id) {
        Check check = checkRepository.findById(id);

        if (check != null)
            return new ResponseEntity<>(check, HttpStatus.OK);

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/checks")
    public ResponseEntity<String> createCheck(@RequestBody Check check) {
        try {
            checkRepository.save(new Check(check.getCheck_number(), check.getId_employee(), check.getCard_number(),
                    check.getSum_total()));
            return new ResponseEntity<>("Check was created successfully.", HttpStatus.CREATED);
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Violates corporate integrity constraints.", HttpStatus.CONFLICT);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/checks/{id}")
    public ResponseEntity<String> deleteCheck(@PathVariable("id") String id) {
        try {
            checkRepository.deleteById(id);
            return new ResponseEntity<>("Check was deleted successfully.", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred while deleting the check.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
