package GestionCours.backend.springboot.Repositrory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import GestionCours.backend.springboot.Entity.ElementCours;




@Repository
public interface ElementCoursRepository  extends JpaRepository<ElementCours, Long>{

}
