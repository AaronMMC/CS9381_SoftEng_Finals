package com.foodapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PickAPlate {

    public static void main(String[] args) {
        SpringApplication.run(PickAPlate.class, args);
        System.out.println("Pick-A-Plate Server is Running...");
    }
}