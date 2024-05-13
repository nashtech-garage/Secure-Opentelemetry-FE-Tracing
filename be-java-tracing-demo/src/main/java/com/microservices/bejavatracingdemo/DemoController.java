package com.microservices.bejavatracingdemo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class DemoController {
	
	private Logger logger = LoggerFactory.getLogger(DemoController.class);

	@GetMapping("/api/outgoing-http-call")
	public String outGoingCall() {
		logger.info("Calling outgoing api...");
		ResponseEntity<String> responseEntity = new RestTemplate().getForEntity
				("https://www.google.com/", String.class);
		return responseEntity.toString();
	}

}
