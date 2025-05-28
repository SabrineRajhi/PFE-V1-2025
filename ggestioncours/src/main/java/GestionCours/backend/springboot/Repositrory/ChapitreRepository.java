package GestionCours.backend.springboot.Repositrory;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import GestionCours.backend.springboot.Entity.Chapitre;


@Repository
public interface ChapitreRepository extends JpaRepository<Chapitre, Long> {

}
