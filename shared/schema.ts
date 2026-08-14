import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  cpf: text("cpf").notNull().unique(),
  nomeCompleto: text("nome_completo").notNull(),
  dataAniversario: timestamp("data_aniversario"),
  nomeMae: text("nome_mae"),
  sexo: text("sexo"),
  email: text("email"),
  telefone: text("telefone"),
  
  // Junta militar selecionada
  juntaName: text("junta_name"),
  juntaAddress: text("junta_address"),
  juntaDistance: decimal("junta_distance", { precision: 10, scale: 6 }),
  juntaType: text("junta_type"),
  juntaPlaceId: text("junta_place_id"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const militaryPositions = pgTable("military_positions", {
  id: serial("id").primaryKey(),
  positionId: text("position_id").notNull().unique(),
  title: text("title").notNull(),
  rank: text("rank").notNull(),
  region: text("region").notNull(),
  city: text("city").notNull(),
  totalVagas: integer("total_vagas").notNull(),
  vagasPreenchidas: integer("vagas_preenchidas").notNull().default(0),
  salary: text("salary").notNull(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const realtimeApplications = pgTable("realtime_applications", {
  id: serial("id").primaryKey(),
  candidateName: text("candidate_name").notNull(),
  positionTitle: text("position_title").notNull(),
  city: text("city").notNull(),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const pixTransactions = pgTable("pix_transactions", {
  id: serial("id").primaryKey(),
  transactionId: text("transaction_id").notNull().unique(),
  candidateId: integer("candidate_id").references(() => candidates.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  
  // Dados da vaga
  vagaId: text("vaga_id").notNull(),
  vagaTitle: text("vaga_title").notNull(),
  vagaCompany: text("vaga_company").notNull(),
  vagaLocation: text("vaga_location").notNull(),
  vagaArea: text("vaga_area"),
  vagaCargaHoraria: text("vaga_carga_horaria"),
  vagaRequirements: text("vaga_requirements"),
  vagaMeta: jsonb("vaga_meta"),
  
  // Dados do local da prova
  localProvaName: text("local_prova_name").notNull(),
  localProvaAddress: text("local_prova_address").notNull(),
  localProvaType: text("local_prova_type"),
  localProvaDistance: decimal("local_prova_distance", { precision: 10, scale: 6 }),
  
  // Data da prova
  dataProva: text("data_prova"),
  horaProva: text("hora_prova"),
  
  // PIX data
  pixCode: text("pix_code"),
  qrCode: text("qr_code"),
  
  // Dados completos da aplicação (JSON)
  applicationData: jsonb("application_data"),
  userData: jsonb("user_data"),
  pessoalData: jsonb("pessoal_data"),
  inscricaoData: jsonb("inscricao_data"),
  
  // Dados de origem/referência
  comeFromRef: text("come_from_ref"),
  
  // Coordenadas geográficas
  coordinates: jsonb("coordinates"),
  
  // Dados da junta militar selecionada
  juntaData: jsonb("junta_data"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const medicalExams = pgTable("medical_exams", {
  id: serial("id").primaryKey(),
  transactionId: text("transaction_id").notNull().unique(),
  candidateId: integer("candidate_id").references(() => candidates.id),
  pixTransactionId: integer("pix_transaction_id").references(() => pixTransactions.id),
  
  // Status do exame médico
  status: text("status").notNull().default("pending"), // pending, paid, scheduled, completed, expired
  
  // Dados do pagamento médico
  medicalAmount: decimal("medical_amount", { precision: 10, scale: 2 }).notNull().default("147.50"),
  medicalPixCode: text("medical_pix_code"),
  medicalQrCode: text("medical_qr_code"),
  medicalTransactionId: text("medical_transaction_id"),
  
  // Local do exame médico
  medicalLocationName: text("medical_location_name"),
  medicalLocationAddress: text("medical_location_address"),
  medicalLocationType: text("medical_location_type"), // ubs, upa, hospital, clinica_credenciada
  medicalLocationDistance: decimal("medical_location_distance", { precision: 10, scale: 6 }),
  medicalLocationPhone: text("medical_location_phone"),
  
  // Agendamento do exame
  scheduledDate: text("scheduled_date"),
  scheduledTime: text("scheduled_time"),
  availableSlots: jsonb("available_slots"),
  
  // Exames necessários
  requiredExams: jsonb("required_exams"), // lista de exames obrigatórios
  completedExams: jsonb("completed_exams"), // exames já realizados
  
  // Dados médicos coletados
  medicalHistory: jsonb("medical_history"),
  currentMedications: text("current_medications"),
  allergies: text("allergies"),
  chronicConditions: text("chronic_conditions"),
  emergencyContact: jsonb("emergency_contact"),
  
  // Resultados
  examResults: jsonb("exam_results"),
  medicalClearance: boolean("medical_clearance").default(false),
  restrictionsOrRecommendations: text("restrictions_or_recommendations"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const faqCache = pgTable("faq_cache", {
  id: serial("id").primaryKey(),
  
  // Hash único do perfil para identificação rápida
  profileHash: text("profile_hash").notNull().unique(),
  
  // Dados do perfil para matching
  idade: integer("idade"),
  genero: text("genero"),
  escolaridade: text("escolaridade"),
  formacao: jsonb("formacao"), // array de strings
  disponibilidade: text("disponibilidade"),
  ambiente: text("ambiente"),
  pressao: text("pressao"),
  hierarquia: text("hierarquia"),
  alistamento_anterior: text("alistamento_anterior"),
  
  // Dados específicos para mulheres
  acao_social: text("acao_social"),
  presenca_feminina: text("presenca_feminina"),
  disponibilidade_parcial: text("disponibilidade_parcial"),
  cuidados_familiares: text("cuidados_familiares"),
  
  // Localização
  cidade: text("cidade"),
  uf: text("uf"),
  
  // FAQs gerados pela IA (JSON)
  faqs: jsonb("faqs").notNull(),
  
  // Metadados
  usageCount: integer("usage_count").notNull().default(1),
  lastUsed: timestamp("last_used").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCandidateSchema = createInsertSchema(candidates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMilitaryPositionSchema = createInsertSchema(militaryPositions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRealtimeApplicationSchema = createInsertSchema(realtimeApplications).omit({
  id: true,
  createdAt: true,
});

export const insertPixTransactionSchema = createInsertSchema(pixTransactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMedicalExamSchema = createInsertSchema(medicalExams).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFaqCacheSchema = createInsertSchema(faqCache).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Candidate = typeof candidates.$inferSelect;
export type InsertMilitaryPosition = z.infer<typeof insertMilitaryPositionSchema>;
export type MilitaryPosition = typeof militaryPositions.$inferSelect;
export type InsertRealtimeApplication = z.infer<typeof insertRealtimeApplicationSchema>;
export type RealtimeApplication = typeof realtimeApplications.$inferSelect;
export type InsertPixTransaction = z.infer<typeof insertPixTransactionSchema>;
export type PixTransaction = typeof pixTransactions.$inferSelect;
export type InsertMedicalExam = z.infer<typeof insertMedicalExamSchema>;
export type MedicalExam = typeof medicalExams.$inferSelect;
export type InsertFaqCache = z.infer<typeof insertFaqCacheSchema>;
export type FaqCache = typeof faqCache.$inferSelect;
