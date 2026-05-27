import { PersonaModel } from "./persona.model";

export class AlumnoModel extends PersonaModel {
  private legajo: number;
  private fechaAlta: string;
  private modificacion: string;
  private isActive: boolean;

  constructor(
    legajo: number,
    nombre: string,
    apellido: string,
    email: string,
    fechaAlta: string,
    modificacion: string,
    isActive: boolean
  ) {
    super(nombre, apellido, email);
    this.legajo = legajo;
    this.fechaAlta = fechaAlta;
    this.modificacion = modificacion;
    this.isActive = isActive;
  }

    // legajo
    public getLegajo(): number {
      return this.legajo
    }
    public setLegajo(legajo: number): void {
      this.legajo = legajo
    }

    // fechaAlta
    public getFechaAlta(): string {
      return this.fechaAlta
    }
    public setFechaAlta(fechaAlta: string): void {
      this.fechaAlta = fechaAlta
    }

    // modificacion
    public getModificacion(): string {
      return this.modificacion
    }
    public setModificacion(modificacion: string): void {
      this.modificacion = modificacion
    }

    // isActive
    public getIsActive(): boolean {
      return this.isActive
    }
    public setIsActive(isActive: boolean): void {
      this.isActive = isActive
    }

    
    // sobrescribimos el método del padre
    public  getAllAttributes(): object {
      return {
        ...super.getAllAttributes(),
        legajo: this.legajo,
        fechaAlta: this.fechaAlta,
        modificacion: this.modificacion,
        isActive: this.isActive
      }
    }
  }