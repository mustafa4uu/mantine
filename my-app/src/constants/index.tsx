export const CUSTOMER_NAME_API = '/api/v1/customers/customer-name?name=';
export const APIDATA = {
  "obligorId": "OBLIGOR-010",
  "cpId": "CP-123",
  "collaterals": [
    {
      "id": "011d2fa5-58d3-4f54-816f-65745800c257",
      "collateralId": "COL0000000017",
      "category": "Aircraft",
      "description": "This is Aircraft Collateral",
      "amount": {
        "value": 34534,
        "currency": "AED",
        "baseValue": 34534,
        "baseCurrency": "AED"
      },
      "allocationModel": "PROPORTIONATE",
      "isChanged": 0
    },
    {
      "id": "02b80296-aa81-4274-917e-15f38c875c0a",
      "collateralId": "COL0000000099",
      "category": "Property",
      "description": "This is Property Collateral",
      "amount": {
        "value": 245600,
        "currency": "USD",
        "baseValue": 901966,
        "baseCurrency": "AED"
      },
      "allocationModel": "PERCENTAGE",
      "isChanged": 0
    },
    {
      "id": "03a9925c-85ea-4b68-ae32-4837af919625",
      "collateralId": "COL0000000011",
      "category": "Machinery",
      "description": "Plant & Machinery Collateral",
      "amount": {
        "value": 1200000,
        "currency": "USD",
        "baseValue": 4407000,
        "baseCurrency": "AED"
      },
      "allocationModel": "ABSOLUTE",
      "isChanged": 0
    }
  ],
  "facilities": [
    {
      "id": "410718e8-c7a7-4a02-9c3b-cabf91f3599b",
      "limitId": "LIM0000000519",
      "name": "CORPORATE",
      "limitProposed": {
        "value": 500000,
        "currency": "INR",
        "baseValue": 2000000,
        "baseCurrency": "AED"
      },
      "limitUtilised": {
        "currency": "INR",
        "baseValue": 0,
        "baseCurrency": "AED"
      },
      "coverage": {
        "03a9925c-85ea-4b68-ae32-4837af919625": {
          "pct": 0,
          "value": 0
        },
        "011d2fa5-58d3-4f54-816f-65745800c257": {
          "pct": 10,
          "value": 3453.40
        },
        "02b80296-aa81-4274-917e-15f38c875c0a": {
          "pct": 0,
          "value": 0
        }
      },
      "ltvPct": 0
    },
    {
      "id": "b3ec60dd-e6d4-45ed-bd07-d758f162c2a0",
      "limitId": "LIM0000000610",
      "name": "CORPORATE",
      "limitProposed": {
        "value": 500000,
        "currency": "EUR",
        "baseValue": 2000000,
        "baseCurrency": "AED"
      },
      "limitUtilised": {
        "currency": "EUR",
        "baseValue": 0,
        "baseCurrency": "AED"
      },
      "coverage": {
        "03a9925c-85ea-4b68-ae32-4837af919625": {
          "pct": 0,
          "value": 0
        },
        "011d2fa5-58d3-4f54-816f-65745800c257": {
          "pct": 0,
          "value": 0
        },
        "02b80296-aa81-4274-917e-15f38c875c0a": {
          "pct": 0,
          "value": 0
        }
      },
      "ltvPct": 0
    },
    {
      "id": "ea8a8dd5-5f48-4ff3-9e21-cc9cd41d693c",
      "limitId": "LIM0000000580",
      "name": "CORPORATE",
      "limitProposed": {
        "value": 500000,
        "currency": "EUR",
        "baseValue": 2000000,
        "baseCurrency": "AED"
      },
      "limitUtilised": {
        "currency": "EUR",
        "baseValue": 0,
        "baseCurrency": "AED"
      },
      "coverage": {
        "03a9925c-85ea-4b68-ae32-4837af919625": {
          "pct": 0,
          "value": 0
        },
        "011d2fa5-58d3-4f54-816f-65745800c257": {
          "pct": 0,
          "value": 0
        },
        "02b80296-aa81-4274-917e-15f38c875c0a": {
          "pct": 0,
          "value": 0
        }
      },
      "ltvPct": 0
    },
    {
      "id": "49fc7664-1056-40b8-8c26-e32b6283a63e",
      "limitId": "LIM0000000578",
      "name": "CORPORATE",
      "limitProposed": {
        "value": 500000,
        "currency": "EUR",
        "baseValue": 2000000,
        "baseCurrency": "AED"
      },
      "limitUtilised": {
        "currency": "EUR",
        "baseValue": 0,
        "baseCurrency": "AED"
      },
      "coverage": {
        "03a9925c-85ea-4b68-ae32-4837af919625": {
          "pct": 0,
          "value": 0
        },
        "011d2fa5-58d3-4f54-816f-65745800c257": {
          "pct": 0,
          "value": 0
        },
        "02b80296-aa81-4274-917e-15f38c875c0a": {
          "pct": 0,
          "value": 0
        }
      },
      "ltvPct": 0
    },
    {
      "id": "71572627-1ee7-4e86-9e1d-70b2e253fcfa",
      "limitId": "LIM0000000604",
      "name": "CORPORATE",
      "limitProposed": {
        "value": 500000,
        "currency": "EUR",
        "baseValue": 2000000,
        "baseCurrency": "AED"
      },
      "limitUtilised": {
        "currency": "EUR",
        "baseValue": 0,
        "baseCurrency": "AED"
      },
      "coverage": {
        "03a9925c-85ea-4b68-ae32-4837af919625": {
          "pct": 0,
          "value": 0
        },
        "011d2fa5-58d3-4f54-816f-65745800c257": {
          "pct": 0,
          "value": 0
        },
        "02b80296-aa81-4274-917e-15f38c875c0a": {
          "pct": 0,
          "value": 0
        }
      },
      "ltvPct": 0
    },
    {
      "id": "54be21a7-0938-454e-b8bb-3aad95783ef2",
      "limitId": "LIM0000000492",
      "name": "CORPORATE",
      "limitProposed": {
        "value": 50000011,
        "currency": "EUR",
        "baseValue": 200000044,
        "baseCurrency": "AED"
      },
      "limitUtilised": {
        "value": 12345,
        "currency": "EUR",
        "baseValue": 49380,
        "baseCurrency": "AED"
      },
      "coverage": {
        "03a9925c-85ea-4b68-ae32-4837af919625": {
          "pct": 0,
          "value": 0
        },
        "011d2fa5-58d3-4f54-816f-65745800c257": {
          "pct": 0,
          "value": 0
        },
        "02b80296-aa81-4274-917e-15f38c875c0a": {
          "pct": 0,
          "value": 0
        }
      },
      "ltvPct": 0
    },
    {
      "id": "b26206d4-a61b-4243-a62e-21e73bbab1eb",
      "limitId": "LIM0000000611",
      "name": "CORPORATE",
      "limitProposed": {
        "value": 500000,
        "currency": "EUR",
        "baseValue": 2000000,
        "baseCurrency": "AED"
      },
      "limitUtilised": {
        "currency": "EUR",
        "baseValue": 0,
        "baseCurrency": "AED"
      },
      "coverage": {
        "03a9925c-85ea-4b68-ae32-4837af919625": {
          "pct": 0,
          "value": 0
        },
        "011d2fa5-58d3-4f54-816f-65745800c257": {
          "pct": 0,
          "value": 0
        },
        "02b80296-aa81-4274-917e-15f38c875c0a": {
          "pct": 0,
          "value": 0
        }
      },
      "ltvPct": 0
    },
    {
      "id": "3366a65b-1d3e-4f2d-894e-656ee737f08f",
      "limitId": "LIM0000000613",
      "name": "CORPORATE",
      "limitProposed": {
        "value": 500000,
        "currency": "EUR",
        "baseValue": 2000000,
        "baseCurrency": "AED"
      },
      "limitUtilised": {
        "currency": "EUR",
        "baseValue": 0,
        "baseCurrency": "AED"
      },
      "coverage": {
        "03a9925c-85ea-4b68-ae32-4837af919625": {
          "pct": 0,
          "value": 0
        },
        "011d2fa5-58d3-4f54-816f-65745800c257": {
          "pct": 0,
          "value": 0
        },
        "02b80296-aa81-4274-917e-15f38c875c0a": {
          "pct": 0,
          "value": 0
        }
      },
      "ltvPct": 0
    },
    {
      "id": "699fcf18-022a-4a28-ba38-38912d3029b5",
      "limitId": "LIM0000000581",
      "name": "CORPORATE",
      "limitProposed": {
        "value": 60000,
        "currency": "EUR",
        "baseValue": 240000,
        "baseCurrency": "AED"
      },
      "limitUtilised": {
        "currency": "EUR",
        "baseValue": 0,
        "baseCurrency": "AED"
      },
      "coverage": {
        "03a9925c-85ea-4b68-ae32-4837af919625": {
          "pct": 0,
          "value": 0
        },
        "011d2fa5-58d3-4f54-816f-65745800c257": {
          "pct": 0,
          "value": 0
        },
        "02b80296-aa81-4274-917e-15f38c875c0a": {
          "pct": 0,
          "value": 0
        }
      },
      "ltvPct": 0
    },
    {
      "id": "658fd967-a3a7-4b72-b43d-3bf11dd5cb0f",
      "limitId": "LIM0000000584",
      "name": "CORPORATE",
      "limitProposed": {
        "value": 500000,
        "currency": "EUR",
        "baseValue": 2000000,
        "baseCurrency": "AED"
      },
      "limitUtilised": {
        "currency": "EUR",
        "baseValue": 0,
        "baseCurrency": "AED"
      },
      "coverage": {
        "03a9925c-85ea-4b68-ae32-4837af919625": {
          "pct": 0,
          "value": 0
        },
        "011d2fa5-58d3-4f54-816f-65745800c257": {
          "pct": 0,
          "value": 0
        },
        "02b80296-aa81-4274-917e-15f38c875c0a": {
          "pct": 0,
          "value": 0
        }
      },
      "ltvPct": 0
    },
    {
      "id": "73effaf6-524c-4448-add6-cf5eab214c15",
      "limitId": "LIM0000000599",
      "name": "CORPORATE",
      "limitProposed": {
        "value": 500000,
        "currency": "EUR",
        "baseValue": 2000000,
        "baseCurrency": "AED"
      },
      "limitUtilised": {
        "currency": "EUR",
        "baseValue": 0,
        "baseCurrency": "AED"
      },
      "coverage": {
        "03a9925c-85ea-4b68-ae32-4837af919625": {
          "pct": 0,
          "value": 0
        },
        "011d2fa5-58d3-4f54-816f-65745800c257": {
          "pct": 0,
          "value": 0
        },
        "02b80296-aa81-4274-917e-15f38c875c0a": {
          "pct": 0,
          "value": 0
        }
      },
      "ltvPct": 0
    },
    {
      "id": "ab87c99c-ffcb-49db-8465-fcdbfa70e889",
      "limitId": "LIM0000000630",
      "name": "CORPORATE",
      "limitProposed": {
        "value": 500000,
        "currency": "EUR",
        "baseValue": 2000000,
        "baseCurrency": "AED"
      },
      "limitUtilised": {
        "currency": "EUR",
        "baseValue": 0,
        "baseCurrency": "AED"
      },
      "coverage": {
        "03a9925c-85ea-4b68-ae32-4837af919625": {
          "pct": 0,
          "value": 0
        },
        "011d2fa5-58d3-4f54-816f-65745800c257": {
          "pct": 0,
          "value": 0
        },
        "02b80296-aa81-4274-917e-15f38c875c0a": {
          "pct": 0,
          "value": 0
        }
      },
      "ltvPct": 0
    },
    {
      "id": "763ec2f7-cd5b-4dc8-8c7b-40c063d60b6b",
      "limitId": "LIM0000000585",
      "name": "CORPORATE",
      "limitProposed": {
        "value": 500000,
        "currency": "INR",
        "baseValue": 20415,
        "baseCurrency": "AED"
      },
      "limitUtilised": {
        "value": 100000,
        "currency": "INR",
        "baseValue": 4083,
        "baseCurrency": "AED"
      },
      "coverage": {
        "03a9925c-85ea-4b68-ae32-4837af919625": {
          "pct": 0,
          "value": 0
        },
        "011d2fa5-58d3-4f54-816f-65745800c257": {
          "pct": 0,
          "value": 0
        },
        "02b80296-aa81-4274-917e-15f38c875c0a": {
          "pct": 0,
          "value": 0
        }
      },
      "ltvPct": 0
    },
    {
      "id": "7e27e6aa-05ae-465d-9798-401ce246c65e",
      "limitId": "LIM0000000606",
      "name": "CORPORATE",
      "limitProposed": {
        "value": 500000,
        "currency": "EUR",
        "baseValue": 2000000,
        "baseCurrency": "AED"
      },
      "limitUtilised": {
        "currency": "EUR",
        "baseValue": 0,
        "baseCurrency": "AED"
      },
      "coverage": {
        "03a9925c-85ea-4b68-ae32-4837af919625": {
          "pct": 0,
          "value": 0
        },
        "011d2fa5-58d3-4f54-816f-65745800c257": {
          "pct": 0,
          "value": 0
        },
        "02b80296-aa81-4274-917e-15f38c875c0a": {
          "pct": 0,
          "value": 0
        }
      },
      "ltvPct": 0
    },
    {
      "id": "6176f7ad-8475-4b50-b095-24aa454ef64b",
      "limitId": "LIM0000000502",
      "name": "CORPORATE",
      "limitProposed": {
        "value": 50000111,
        "currency": "EUR",
        "baseValue": 200000444,
        "baseCurrency": "AED"
      },
      "limitUtilised": {
        "value": 25,
        "currency": "EUR",
        "baseValue": 100,
        "baseCurrency": "AED"
      },
      "coverage": {
        "03a9925c-85ea-4b68-ae32-4837af919625": {
          "pct": 0,
          "value": 0
        },
        "011d2fa5-58d3-4f54-816f-65745800c257": {
          "pct": 0,
          "value": 0
        },
        "02b80296-aa81-4274-917e-15f38c875c0a": {
          "pct": 0,
          "value": 0
        }
      },
      "ltvPct": 0
    },
    {
      "id": "00a79ab1-47eb-4d08-a246-d25223064d24",
      "limitId": "LIM0000000600",
      "name": "CORPORATE",
      "limitProposed": {
        "value": 500000,
        "currency": "EUR",
        "baseValue": 2000000,
        "baseCurrency": "AED"
      },
      "limitUtilised": {
        "currency": "EUR",
        "baseValue": 0,
        "baseCurrency": "AED"
      },
      "coverage": {
        "03a9925c-85ea-4b68-ae32-4837af919625": {
          "pct": 0,
          "value": 0
        },
        "011d2fa5-58d3-4f54-816f-65745800c257": {
          "pct": 0,
          "value": 0
        },
        "02b80296-aa81-4274-917e-15f38c875c0a": {
          "pct": 0,
          "value": 0
        }
      },
      "ltvPct": 0
    },
    {
      "id": "91759dcd-11c2-4483-abd8-c665eb0fff34",
      "limitId": "LIM0000000582",
      "name": "CORPORATE",
      "limitProposed": {
        "value": 60000,
        "currency": "EUR",
        "baseValue": 240000,
        "baseCurrency": "AED"
      },
      "limitUtilised": {
        "currency": "EUR",
        "baseValue": 0,
        "baseCurrency": "AED"
      },
      "coverage": {
        "03a9925c-85ea-4b68-ae32-4837af919625": {
          "pct": 0,
          "value": 0
        },
        "011d2fa5-58d3-4f54-816f-65745800c257": {
          "pct": 0,
          "value": 0
        },
        "02b80296-aa81-4274-917e-15f38c875c0a": {
          "pct": 0,
          "value": 0
        }
      },
      "ltvPct": 0
    },
    {
      "id": "4f9c7d9a-e37c-469e-8eab-f35b61ee89dc",
      "limitId": "LIM0000000614",
      "name": "CORPORATE",
      "limitProposed": {
        "value": 500000,
        "currency": "EUR",
        "baseValue": 2000000,
        "baseCurrency": "AED"
      },
      "limitUtilised": {
        "currency": "EUR",
        "baseValue": 0,
        "baseCurrency": "AED"
      },
      "coverage": {
        "03a9925c-85ea-4b68-ae32-4837af919625": {
          "pct": 0,
          "value": 0
        },
        "011d2fa5-58d3-4f54-816f-65745800c257": {
          "pct": 0,
          "value": 0
        },
        "02b80296-aa81-4274-917e-15f38c875c0a": {
          "pct": 0,
          "value": 0
        }
      },
      "ltvPct": 0
    },
    {
      "id": "a527a340-04c1-4760-87f0-c86b7f3ab8f0",
      "limitId": "LIM0000000612",
      "name": "CORPORATE",
      "limitProposed": {
        "value": 500000,
        "currency": "EUR",
        "baseValue": 2000000,
        "baseCurrency": "AED"
      },
      "limitUtilised": {
        "currency": "EUR",
        "baseValue": 0,
        "baseCurrency": "AED"
      },
      "coverage": {
        "03a9925c-85ea-4b68-ae32-4837af919625": {
          "pct": 0,
          "value": 0
        },
        "011d2fa5-58d3-4f54-816f-65745800c257": {
          "pct": 0,
          "value": 0
        },
        "02b80296-aa81-4274-917e-15f38c875c0a": {
          "pct": 0,
          "value": 0
        }
      },
      "ltvPct": 0
    },
    {
      "id": "283c9f14-01cc-462d-8764-7e0101981885",
      "limitId": "LIM0000000616",
      "name": "CORPORATE",
      "limitProposed": {
        "value": 500000,
        "currency": "EUR",
        "baseValue": 2000000,
        "baseCurrency": "AED"
      },
      "limitUtilised": {
        "currency": "EUR",
        "baseValue": 0,
        "baseCurrency": "AED"
      },
      "coverage": {
        "03a9925c-85ea-4b68-ae32-4837af919625": {
          "pct": 0,
          "value": 0
        },
        "011d2fa5-58d3-4f54-816f-65745800c257": {
          "pct": 0,
          "value": 0
        },
        "02b80296-aa81-4274-917e-15f38c875c0a": {
          "pct": 0,
          "value": 0
        }
      },
      "ltvPct": 0
    },
    {
      "id": "55d03011-c931-47df-82dc-accf77882d14",
      "limitId": "LIM0000000596",
      "name": "CORPORATE",
      "limitProposed": {
        "value": 500000,
        "currency": "EUR",
        "baseValue": 2000000,
        "baseCurrency": "AED"
      },
      "limitUtilised": {
        "currency": "EUR",
        "baseValue": 0,
        "baseCurrency": "AED"
      },
      "coverage": {
        "03a9925c-85ea-4b68-ae32-4837af919625": {
          "pct": 0,
          "value": 0
        },
        "011d2fa5-58d3-4f54-816f-65745800c257": {
          "pct": 0,
          "value": 0
        },
        "02b80296-aa81-4274-917e-15f38c875c0a": {
          "pct": 0,
          "value": 0
        }
      },
      "ltvPct": 0
    },
    {
      "id": "2cdaa495-df8c-43a6-8858-bf952513b2d1",
      "limitId": "LIM0000000583",
      "name": "CORPORATE",
      "limitProposed": {
        "value": 500000,
        "currency": "EUR",
        "baseValue": 2000000,
        "baseCurrency": "AED"
      },
      "limitUtilised": {
        "currency": "EUR",
        "baseValue": 0,
        "baseCurrency": "AED"
      },
      "coverage": {
        "03a9925c-85ea-4b68-ae32-4837af919625": {
          "pct": 0,
          "value": 0
        },
        "011d2fa5-58d3-4f54-816f-65745800c257": {
          "pct": 0,
          "value": 0
        },
        "02b80296-aa81-4274-917e-15f38c875c0a": {
          "pct": 0,
          "value": 0
        }
      },
      "ltvPct": 0
    },
    {
      "id": "e8eb6689-166c-4afe-ac10-e1eba6038be5",
      "limitId": "LIM0000000615",
      "name": "CORPORATE",
      "limitProposed": {
        "value": 500000,
        "currency": "EUR",
        "baseValue": 2000000,
        "baseCurrency": "AED"
      },
      "limitUtilised": {
        "currency": "EUR",
        "baseValue": 0,
        "baseCurrency": "AED"
      },
      "coverage": {
        "03a9925c-85ea-4b68-ae32-4837af919625": {
          "pct": 0,
          "value": 0
        },
        "011d2fa5-58d3-4f54-816f-65745800c257": {
          "pct": 0,
          "value": 0
        },
        "02b80296-aa81-4274-917e-15f38c875c0a": {
          "pct": 0,
          "value": 0
        }
      },
      "ltvPct": 0
    }
  ],
  "totalsCoverage": {
    "coverageDetails": {
      "03a9925c-85ea-4b68-ae32-4837af919625": {
        "pct": 0,
        "value": 0
      },
      "011d2fa5-58d3-4f54-816f-65745800c257": {
        "pct": 0,
        "value": 0
      },
      "02b80296-aa81-4274-917e-15f38c875c0a": {
        "pct": 0,
        "value": 0
      }
    },
    "ltvPct": 0
  }
};