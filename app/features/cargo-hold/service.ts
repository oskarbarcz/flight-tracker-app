import { normaliseDesignator } from "~/features/cargo-hold/lib/designator";
import type {
  AircraftHoldLayout,
  HoldCompartment,
  HoldDeck,
  HoldPosition,
  HoldVariant,
} from "~/features/cargo-hold/model";
import { AbstractAuthorizedApiService } from "~/shared/api/api.service";

function normalisePosition(position: HoldPosition, compartment: number): HoldPosition {
  return { ...position, designator: normaliseDesignator(position.designator, compartment) };
}

function normaliseCompartment(compartment: HoldCompartment): HoldCompartment {
  return {
    ...compartment,
    positions: compartment.positions.map((position) => normalisePosition(position, compartment.number)),
  };
}

function normaliseDeck(deck: HoldDeck): HoldDeck {
  return { ...deck, compartments: deck.compartments.map(normaliseCompartment) };
}

function normaliseVariant(variant: HoldVariant): HoldVariant {
  return { ...variant, decks: variant.decks.map(normaliseDeck) };
}

function normaliseLayout(layout: AircraftHoldLayout): AircraftHoldLayout {
  return { ...layout, variants: layout.variants.map(normaliseVariant) };
}

export class CargoHoldService extends AbstractAuthorizedApiService {
  async fetchCatalogue(): Promise<AircraftHoldLayout[]> {
    const layouts = await this.fetchWithAuth<AircraftHoldLayout[]>("/api/v1/cargo-hold");
    return layouts.map(normaliseLayout);
  }

  async fetchByType(icaoCode: string): Promise<AircraftHoldLayout> {
    const layout = await this.fetchWithAuth<AircraftHoldLayout>(`/api/v1/cargo-hold/${icaoCode}`);
    return normaliseLayout(layout);
  }
}
