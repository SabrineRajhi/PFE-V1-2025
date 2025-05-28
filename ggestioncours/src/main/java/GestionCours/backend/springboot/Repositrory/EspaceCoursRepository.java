package GestionCours.backend.springboot.Repositrory;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import GestionCours.backend.springboot.Entity.EspaceCours;


@Repository
public interface EspaceCoursRepository  extends JpaRepository<EspaceCours, Long>{
	
	
	
	 @Query("SELECT DISTINCT ec FROM EspaceCours ec " +
	           "LEFT JOIN FETCH ec.elementsCours eCours " +  // matches EspaceCours.elementsCours
	           "LEFT JOIN FETCH eCours.element el " +        // matches ElementCours.element
	           "LEFT JOIN FETCH el.typeElement")             // matches Element.typeElement
	    List<EspaceCours> findAllWithElements();
}
