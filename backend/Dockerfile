# ---------- Build Stage ----------
FROM gradle:8.14.5-jdk21 AS builder

WORKDIR /app
COPY . .

# Evita problemas de permisos al copiar desde Windows.
RUN chmod +x gradlew

# Omite las pruebas para acelerar la construcción de la imagen.
RUN ./gradlew bootJar --no-daemon -x test

# ---------- Runtime Stage ----------
# Imagen JRE ligera para reducir el tamaño final.
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copia únicamente el JAR compilado.
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]