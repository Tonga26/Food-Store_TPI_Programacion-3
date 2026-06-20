package com.utn.foodstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class FoodstoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(FoodstoreApplication.class, args);
	}

}
