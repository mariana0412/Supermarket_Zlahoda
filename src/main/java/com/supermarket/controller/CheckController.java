package com.supermarket.controller;

import com.supermarket.model.Check;
import com.supermarket.repository.CheckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api")
public class CheckController {
    @Autowired
    CheckRepository checkRepository;

    @GetMapping("/checks")
    public ResponseEntity<List<Check>> getAllChecks() {
        try {
            List<Check> checks = new ArrayList<>(checkRepository.findAll());

            if (checks.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            return new ResponseEntity<>(checks, HttpStatus.OK);
        } catch (Exception e) {
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
                    check.getPrint_date(), check.getSum_total(), check.getVat()));
            return new ResponseEntity<>("Check was created successfully.", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/checks/{id}")
    public ResponseEntity<String> updateCheck(@PathVariable("id") String id, @RequestBody Check check) {
        Check _check = checkRepository.findById(id);

        if (_check != null) {
            _check.setCheck_number(id);
            _check.setId_employee(check.getId_employee());
            _check.setCard_number(check.getCard_number());
            _check.setPrint_date(check.getPrint_date());
            _check.setSum_total(check.getSum_total());
            _check.setVat(check.getVat());
            checkRepository.update(_check);
            return new ResponseEntity<>("Check was updated successfully.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Cannot find Check with id=" + id, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/checks/{id}")
    public ResponseEntity<String> deleteCheck(@PathVariable("id") String id) {
        try {
            System.out.println(id);
            int result = checkRepository.deleteById(id);
            if (result == 0) {
                return new ResponseEntity<>("Cannot find Check with id=" + id, HttpStatus.OK);
            }
            return new ResponseEntity<>("Check was deleted successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Cannot delete Check.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}