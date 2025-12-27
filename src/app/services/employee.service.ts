import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly STORAGE_KEY = 'employees';
  private employeesSubject = new BehaviorSubject<Employee[]>(this.loadEmployees());
  public employees$ = this.employeesSubject.asObservable();

  constructor() {
    this.loadEmployees();
  }

  private loadEmployees(): Employee[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveEmployees(employees: Employee[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(employees));
    this.employeesSubject.next(employees);
  }

  getAllEmployees(): Employee[] {
    return this.loadEmployees();
  }

  getEmployeeById(id: number): Employee | undefined {
    const employees = this.loadEmployees();
    return employees.find(emp => emp.id === id);
  }

  addEmployee(employee: Omit<Employee, 'id'>): Employee {
    const employees = this.loadEmployees();
    const newEmployee: Employee = {
      ...employee,
      id: this.generateId(employees)
    };
    employees.push(newEmployee);
    this.saveEmployees(employees);
    return newEmployee;
  }

  updateEmployee(id: number, employee: Partial<Employee>): Employee | null {
    const employees = this.loadEmployees();
    const index = employees.findIndex(emp => emp.id === id);
    if (index === -1) return null;
    
    employees[index] = { ...employees[index], ...employee };
    this.saveEmployees(employees);
    return employees[index];
  }

  deleteEmployee(id: number): boolean {
    const employees = this.loadEmployees();
    const filtered = employees.filter(emp => emp.id !== id);
    if (filtered.length === employees.length) return false;
    
    this.saveEmployees(filtered);
    return true;
  }

  private generateId(employees: Employee[]): number {
    if (employees.length === 0) return 1;
    return Math.max(...employees.map(emp => emp.id)) + 1;
  }
}





