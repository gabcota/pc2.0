CREATE TABLE IF NOT EXISTS "candidates" (
  "id" serial PRIMARY KEY NOT NULL,
  "cpf" text NOT NULL,
  "nome_completo" text NOT NULL,
  "data_aniversario" timestamp,
  "nome_mae" text,
  "sexo" text,
  "email" text,
  "telefone" text,
  "junta_name" text,
  "junta_address" text,
  "junta_distance" numeric(10, 6),
  "junta_type" text,
  "junta_place_id" text,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  CONSTRAINT "candidates_cpf_unique" UNIQUE("cpf")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "faq_cache" (
  "id" serial PRIMARY KEY NOT NULL,
  "profile_hash" text NOT NULL,
  "idade" integer,
  "genero" text,
  "escolaridade" text,
  "formacao" jsonb,
  "disponibilidade" text,
  "ambiente" text,
  "pressao" text,
  "hierarquia" text,
  "alistamento_anterior" text,
  "acao_social" text,
  "presenca_feminina" text,
  "disponibilidade_parcial" text,
  "cuidados_familiares" text,
  "cidade" text,
  "uf" text,
  "faqs" jsonb NOT NULL,
  "usage_count" integer DEFAULT 1 NOT NULL,
  "last_used" timestamp DEFAULT now(),
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  CONSTRAINT "faq_cache_profile_hash_unique" UNIQUE("profile_hash")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medical_exams" (
  "id" serial PRIMARY KEY NOT NULL,
  "transaction_id" text NOT NULL,
  "candidate_id" integer,
  "pix_transaction_id" integer,
  "status" text DEFAULT 'pending' NOT NULL,
  "medical_amount" numeric(10, 2) DEFAULT '147.50' NOT NULL,
  "medical_pix_code" text,
  "medical_qr_code" text,
  "medical_transaction_id" text,
  "medical_location_name" text,
  "medical_location_address" text,
  "medical_location_type" text,
  "medical_location_distance" numeric(10, 6),
  "medical_location_phone" text,
  "scheduled_date" text,
  "scheduled_time" text,
  "available_slots" jsonb,
  "required_exams" jsonb,
  "completed_exams" jsonb,
  "medical_history" jsonb,
  "current_medications" text,
  "allergies" text,
  "chronic_conditions" text,
  "emergency_contact" jsonb,
  "exam_results" jsonb,
  "medical_clearance" boolean DEFAULT false,
  "restrictions_or_recommendations" text,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  CONSTRAINT "medical_exams_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "military_positions" (
  "id" serial PRIMARY KEY NOT NULL,
  "position_id" text NOT NULL,
  "title" text NOT NULL,
  "rank" text NOT NULL,
  "region" text NOT NULL,
  "city" text NOT NULL,
  "total_vagas" integer NOT NULL,
  "vagas_preenchidas" integer DEFAULT 0 NOT NULL,
  "salary" text NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  CONSTRAINT "military_positions_position_id_unique" UNIQUE("position_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pix_transactions" (
  "id" serial PRIMARY KEY NOT NULL,
  "transaction_id" text NOT NULL,
  "candidate_id" integer,
  "amount" numeric(10, 2) NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "vaga_id" text NOT NULL,
  "vaga_title" text NOT NULL,
  "vaga_company" text NOT NULL,
  "vaga_location" text NOT NULL,
  "vaga_area" text,
  "vaga_carga_horaria" text,
  "vaga_requirements" text,
  "vaga_meta" jsonb,
  "local_prova_name" text NOT NULL,
  "local_prova_address" text NOT NULL,
  "local_prova_type" text,
  "local_prova_distance" numeric(10, 6),
  "data_prova" text,
  "hora_prova" text,
  "pix_code" text,
  "qr_code" text,
  "application_data" jsonb,
  "user_data" jsonb,
  "pessoal_data" jsonb,
  "inscricao_data" jsonb,
  "come_from_ref" text,
  "coordinates" jsonb,
  "junta_data" jsonb,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  CONSTRAINT "pix_transactions_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "realtime_applications" (
  "id" serial PRIMARY KEY NOT NULL,
  "candidate_name" text NOT NULL,
  "position_title" text NOT NULL,
  "city" text NOT NULL,
  "created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY NOT NULL,
  "username" text NOT NULL,
  "password" text NOT NULL,
  CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "medical_exams" ADD CONSTRAINT "medical_exams_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "medical_exams" ADD CONSTRAINT "medical_exams_pix_transaction_id_pix_transactions_id_fk" FOREIGN KEY ("pix_transaction_id") REFERENCES "public"."pix_transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "pix_transactions" ADD CONSTRAINT "pix_transactions_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
