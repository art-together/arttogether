package com.pm.eggs.repo;


import com.pm.eggs.entity.Egg;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EggRepo extends JpaRepository<Egg, Long> {
}
