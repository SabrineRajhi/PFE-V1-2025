package GestionCours.backend.springboot.Services;


import java.util.List;

import GestionCours.backend.springboot.Entity.EspaceCours;





public interface EspaceCoursServiceInterface {



	List<EspaceCours> getAllespacecours();

	EspaceCours addEspace(EspaceCours espaceCours);

	EspaceCours getEspaceCoursById(long id);

	EspaceCours updateEspaceCours(long id, EspaceCours espaceCours);

	void deleteEspaceCours(long id);

	EspaceCours getEspaceCoursById(Long id);

	List<EspaceCours> getAllWithElements();



}
