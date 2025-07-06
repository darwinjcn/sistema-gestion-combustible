# Diagrama de Secuencia - Flujo de Guardado de Datos

## Sistema de Gestión de Combustible CANTV Lara

```mermaid
sequenceDiagram
    participant U as Usuario
    participant UI as React Frontend
    participant API as Django API
    participant VS as ConsumoViewSet
    participant SER as ConsumoSerializer
    participant MOD as DatosConsumo Model
    participant DB as SQLite Database
    participant GEN as GeneradorElectrico

    Note over U, DB: Flujo de Guardado de Datos de Consumo

    %% 1. Ingreso de datos
    U->>UI: Completa formulario
    Note right of U: - ID Generador<br/>- Nivel Actual<br/>- Consumo
    
    %% 2. Validación Frontend
    UI->>UI: Validar campos requeridos
    alt Validación fallida
        UI->>U: Mostrar errores
    else Validación exitosa
        UI->>UI: Preparar datos JSON
        
        %% 3. Envío a API
        UI->>API: POST /api/consumos/
        Note right of UI: Headers:<br/>- Authorization: Token<br/>- Content-Type: application/json
        
        %% 4. Autenticación
        API->>API: Verificar token
        alt Token inválido
            API->>UI: 401 Unauthorized
            UI->>U: Error de autenticación
        else Token válido
            
            %% 5. Procesamiento en ViewSet
            API->>VS: perform_create()
            VS->>VS: Extraer datos del request
            
            %% 6. Validación de Generador
            VS->>GEN: objects.get(id=generador_id)
            alt Generador no existe
                GEN->>VS: DoesNotExist Exception
                VS->>API: ValidationError
                API->>UI: 400 Bad Request
                UI->>U: Error: Generador no existe
            else Generador existe
                GEN->>VS: Instancia de GeneradorElectrico
                
                %% 7. Cálculo de consumo
                VS->>VS: Calcular consumo si es necesario
                alt Consumo = 0
                    VS->>MOD: objects.filter().order_by('-fecha').first()
                    MOD->>VS: Último registro
                    VS->>VS: consumo = abs(nivel_anterior - nivel_actual)
                end
                
                %% 8. Serialización
                VS->>SER: save(generador, nivel_actual, consumo)
                SER->>SER: validate()
                alt Validación fallida
                    SER->>VS: ValidationError
                    VS->>API: ValidationError
                    API->>UI: 400 Bad Request
                    UI->>U: Errores de validación
                else Validación exitosa
                    
                    %% 9. Guardado en BD
                    SER->>MOD: create()
                    MOD->>MOD: Validaciones del modelo
                    MOD->>DB: INSERT INTO datos_consumo
                    DB->>MOD: Confirmación
                    MOD->>SER: Instancia creada
                    
                    %% 10. Respuesta exitosa
                    SER->>VS: Datos serializados
                    VS->>API: 201 Created
                    API->>UI: Response con datos
                    
                    %% 11. Actualización UI
                    UI->>UI: Limpiar formulario
                    UI->>UI: Mostrar mensaje éxito
                    UI->>U: ✅ Datos guardados correctamente
                    
                    %% 12. Actualización automática
                    UI->>UI: Refrescar listado
                    UI->>API: GET /api/consumos/
                    API->>UI: Datos actualizados
                    UI->>U: Tabla actualizada
                end
            end
        end
    end

    Note over U, DB: Proceso completado exitosamente