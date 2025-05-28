package GestionCours.backend.springboot.Controllers;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.security.auth.login.AccountNotFoundException;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import GestionCours.backend.springboot.Entity.User;
import GestionCours.backend.springboot.Services.UserService;
import GestionCours.backend.springboot.Exception.UserNotFoundException;
import GestionCours.backend.springboot.Exception.accountNotFoundException;





import java.util.List;

import java.util.Map;



import javax.security.auth.login.AccountNotFoundException;





import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.validation.annotation.Validated;

import org.springframework.web.bind.annotation.DeleteMapping;

import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.PutMapping;

import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;



import GestionCours.backend.springboot.Entity.User;

import GestionCours.backend.springboot.Services.UserService;

import GestionCours.backend.springboot.Exception.UserNotFoundException;

import GestionCours.backend.springboot.Exception.accountNotFoundException;



@RestController

@RequestMapping("/users")

public class Usercontrollers {



    @Autowired

    private UserService userService;



    // Récupérer tous les utilisateurs (réservé aux admins)

    @PreAuthorize("hasRole('ADMIN')")

    @GetMapping("/all")

    public ResponseEntity<List<User>> getAllUsers() {

        List<User> users = userService.getAllUsers();

        return ResponseEntity.ok(users);

    }



    /*// Ajouter un utilisateur (accessible à tous pour l'inscription)

    @PostMapping("/add")

    public ResponseEntity<?> createUser(@RequestBody User user) {

        // Vérifier si l'email existe déjà

        if (userService.getUserByEmail(user.getEmail()) != null) {

            return ResponseEntity.badRequest().body("Email already exists.");

        }

        User savedUser = userService.addUser(user);

        return ResponseEntity.ok(savedUser);

    }



    // Mettre à jour un utilisateur (réservé aux admins ou à l'utilisateur concerné)

    @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #id")

    @PutMapping("/update/{id}")

    public ResponseEntity<?> updateUser(@PathVariable Long id, @Validated @RequestBody User user) throws AccountNotFoundException {

        User updatedUser = userService.updateUser(id, user);

		return ResponseEntity.ok(updatedUser);

    }



    // Supprimer un utilisateur (réservé aux admins)

   // @PreAuthorize("hasRole('ADMIN')")

    @DeleteMapping("/delete/{id}")

    public ResponseEntity<String> deleteUser(@PathVariable Long id) {

        try {

            userService.deleteUser(id);

            return ResponseEntity.ok("Utilisateur supprimé avec succès !");

        } catch (accountNotFoundException ex) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());

        }

    }*/

    // Find user by email

    @GetMapping("/findByEmail/{email}")

    public ResponseEntity<User> findByEmail(@PathVariable String email) {

        User user = userService.findByEmail(email);

        if (user != null) {

            return ResponseEntity.ok(user);

        } else {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);

        }

    }

    @GetMapping("/findById/{userId}")

    public ResponseEntity<User> findById(@PathVariable long userId) {

        User user = userService.findById(userId);

        if (user != null) {

            return ResponseEntity.ok(user);

        } else {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);

        }

    }



    // Récupérer un utilisateur par ID (réservé aux admins ou à l'utilisateur concerné)

    @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #id")

    @GetMapping("/{id}")

    public ResponseEntity<?> getUserById(@PathVariable Long id) {

        try {

            User user = userService.getUserById(id);

            return ResponseEntity.ok(user);

        } catch (UserNotFoundException ex) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());

        }

    }

    @PreAuthorize("hasRole('ADMIN')")

    @PutMapping("/activate/{userId}")

    public ResponseEntity<String> activateUser(@PathVariable Long userId) {

        String response = userService.activateUser(userId);

        return ResponseEntity.ok(response);

    }



    @PreAuthorize("hasRole('ADMIN')")

    @PutMapping("/block/{userId}")

    public ResponseEntity<String> blockUser(@PathVariable Long userId, @RequestBody Map<String, String> request) {

        try {

            // Extract reason for blocking from request body

            String reason = request.get("reason");



            // Call the service method to block the user

            userService.blockUser(userId, reason);



            // Return a success response

            return ResponseEntity.ok("User blocked successfully");

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error blocking the user: " + e.getMessage());

        }

    }



    @PreAuthorize("hasRole('ADMIN')")

    @PutMapping("/rejetee/{userId}")

    public ResponseEntity<String> rejeteeUser(@PathVariable Long userId, @RequestBody Map<String, String> request) {

        String reason = request.get("reason");

        String response = userService.rejectUser(userId, reason);

        if (response.equals("User not found")) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);

        }

        return ResponseEntity.ok(response);

    }



    @PreAuthorize("hasRole('ADMIN')")

    // Unblock user method

    @PutMapping("/unblock/{userId}")

    public ResponseEntity<String> unblockUser(@PathVariable Long userId) {

        try {

            // Call the service method to unblock the user

            userService.unblockUser(userId);



            // Return a success response

            return ResponseEntity.ok("User unblocked successfully");

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error unblocking the user: " + e.getMessage());

        }

    }



 

    @PreAuthorize("hasRole('ADMIN')")

    @DeleteMapping("/delete/{userId}")

    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {

        userService.deleteUser(userId);

        return ResponseEntity.noContent().build();

    }



}