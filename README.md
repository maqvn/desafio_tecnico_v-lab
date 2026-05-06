## Comandos Docker - Banco de Dados

### Subir o container com a imagem PostgreSQL
```bash
docker compose up -d
```

### Acessar o terminal do PostgreSQL no container
```bash
docker exec -it course_sphere_db psql -U admin -d coursesphere_db
```