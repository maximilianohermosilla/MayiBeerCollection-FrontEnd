export interface Cerveza{
    id: number;
    nombre: string;
    ibu?: number;
    alcohol?: number;
    idMarca: number;
    nombreMarca:string;
    idEstilo?: number;
    nombreEstilo: string;
    idCiudad?: number;
    nombreCiudad: string;
    idPais?: number;
    nombrePais: string;
    observaciones: string;
    contenido?: number;
    imagen?: string;
    imageFile?: string;
}