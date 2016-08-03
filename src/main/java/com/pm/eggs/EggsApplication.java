package com.pm.eggs;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class })
public class EggsApplication {

	@Bean(name = "dataSource")
	public DataSource dataSource()  {

		URI dbUri;
		try {
			String username = "postgres";
			String password = "admin";
			String url = "jdbc:postgresql://localhost:5432/eggs";
			String dbProperty = System.getenv("DATABASE_URL");
			if(dbProperty != null) {
				dbUri = new URI(dbProperty);

				username = dbUri.getUserInfo().split(":")[0];
				password = dbUri.getUserInfo().split(":")[1];
				url = "jdbc:postgresql://" + dbUri.getHost() + ':' + dbUri.getPort() + dbUri.getPath();
			}

			HikariDataSource dataSource = new HikariDataSource();
			dataSource.setJdbcUrl(url);
			dataSource.setUsername(username);
			dataSource.setPassword(password);
			return dataSource;

		} catch (URISyntaxException e) {
			//Deal with errors here.
			return null;
		}
	}

	public static void main(String[] args) {
		SpringApplication.run(EggsApplication.class, args);
	}
}
