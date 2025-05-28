package GestionCours.backend.springboot.Repositrory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import GestionCours.backend.springboot.Entity.Niveau;




@Repository
public interface NiveauRepository extends JpaRepository<Niveau, Long> {

}
