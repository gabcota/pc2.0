import { 
  users, candidates, pixTransactions, militaryPositions, realtimeApplications,
  type User, type InsertUser, type Candidate, type PixTransaction,
  type MilitaryPosition, type InsertMilitaryPosition,
  type RealtimeApplication, type InsertRealtimeApplication
} from "@shared/schema";
import { db, safeRows, safeInsertReturn } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getCandidateByEmail(email: string): Promise<Candidate | undefined>;
  getCandidateById(id: number): Promise<Candidate | undefined>;
  getCandidateWithTransactions(candidateId: number): Promise<{ candidate: Candidate; transactions: PixTransaction[] } | undefined>;
  updateCandidateJunta(candidateId: number, juntaData: {
    juntaName: string;
    juntaAddress: string;
    juntaDistance: number;
    juntaType: string;
    juntaPlaceId: string;
  }): Promise<void>;
  
  // PIX Transaction methods
  getPixTransactionByProtocol(protocolId: string): Promise<PixTransaction | undefined>;
  
  // Military positions methods
  getMilitaryPositions(): Promise<MilitaryPosition[]>;
  getMilitaryPositionsByRegion(region: string): Promise<MilitaryPosition[]>;
  updatePositionVagas(positionId: string, vagasPreenchidas: number): Promise<void>;
  initializeMilitaryPositions(): Promise<void>;
  
  // Realtime applications methods
  getRecentApplications(limit?: number): Promise<RealtimeApplication[]>;
  addRealtimeApplication(application: InsertRealtimeApplication): Promise<RealtimeApplication>;
  generateFakeApplication(): Promise<RealtimeApplication>;
}

export class DatabaseStorage implements IStorage {
  // Bug 1: safeRows() guards against null returned by Neon driver instead of []

  async getUser(id: number): Promise<User | undefined> {
    const [user] = safeRows(await db.select().from(users).where(eq(users.id, id)));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = safeRows(await db.select().from(users).where(eq(users.username, username)));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Bug 3: .returning() may be empty even on successful insert → compensating SELECT
    return safeInsertReturn(
      await db.insert(users).values(insertUser).returning(),
      () => this.getUserByUsername(insertUser.username),
    );
  }

  async getCandidateByEmail(email: string): Promise<Candidate | undefined> {
    const [candidate] = safeRows(await db.select().from(candidates).where(eq(candidates.email, email)));
    return candidate || undefined;
  }

  async getCandidateById(id: number): Promise<Candidate | undefined> {
    const [candidate] = safeRows(await db.select().from(candidates).where(eq(candidates.id, id)));
    return candidate || undefined;
  }

  async getPixTransactionByProtocol(protocolId: string): Promise<PixTransaction | undefined> {
    const [transaction] = safeRows(await db.select().from(pixTransactions).where(eq(pixTransactions.transactionId, protocolId)));
    return transaction || undefined;
  }

  async getCandidateWithTransactions(candidateId: number): Promise<{ candidate: Candidate; transactions: PixTransaction[] } | undefined> {
    const [candidate] = safeRows(await db.select().from(candidates).where(eq(candidates.id, candidateId)));
    if (!candidate) return undefined;

    const transactions = safeRows(await db.select().from(pixTransactions).where(eq(pixTransactions.candidateId, candidateId)));
    return { candidate, transactions };
  }

  async updateCandidateJunta(candidateId: number, juntaData: {
    juntaName: string;
    juntaAddress: string;
    juntaDistance: number;
    juntaType: string;
    juntaPlaceId: string;
  }): Promise<void> {
    await db.update(candidates)
      .set({
        juntaName: juntaData.juntaName,
        juntaAddress: juntaData.juntaAddress,
        juntaDistance: juntaData.juntaDistance.toString(),
        juntaType: juntaData.juntaType,
        juntaPlaceId: juntaData.juntaPlaceId,
        updatedAt: new Date()
      })
      .where(eq(candidates.id, candidateId));
  }

  // Military positions methods
  async getMilitaryPositions(): Promise<MilitaryPosition[]> {
    return safeRows(await db.select().from(militaryPositions).orderBy(militaryPositions.region, militaryPositions.position));
  }

  async getMilitaryPositionsByRegion(region: string): Promise<MilitaryPosition[]> {
    return safeRows(await db.select().from(militaryPositions).where(eq(militaryPositions.region, region)));
  }

  async updatePositionVagas(positionId: string, vagasPreenchidas: number): Promise<void> {
    await db.update(militaryPositions)
      .set({ vagasPreenchidas })
      .where(eq(militaryPositions.id, positionId));
  }

  async initializeMilitaryPositions(): Promise<void> {
    // Implementation for initializing military positions
  }

  // Realtime applications methods
  async getRecentApplications(limit: number = 10): Promise<RealtimeApplication[]> {
    return safeRows(
      await db.select().from(realtimeApplications)
        .orderBy(desc(realtimeApplications.createdAt))
        .limit(limit)
    );
  }

  async addRealtimeApplication(application: InsertRealtimeApplication): Promise<RealtimeApplication> {
    // Bug 3: .returning() may be empty → compensating SELECT by most-recent row
    return safeInsertReturn(
      await db.insert(realtimeApplications).values(application).returning(),
      async () => {
        const [row] = safeRows(
          await db.select().from(realtimeApplications)
            .orderBy(desc(realtimeApplications.createdAt))
            .limit(1)
        );
        return row;
      },
    );
  }

  async generateFakeApplication(): Promise<RealtimeApplication> {
    const fakeApplication: InsertRealtimeApplication = {
      candidateName: `Candidato ${Date.now()}`,
      position: "Soldado Temporário",
      region: "Sudeste",
      status: "pending"
    };
    return await this.addRealtimeApplication(fakeApplication);
  }
}

export const storage = new DatabaseStorage();
