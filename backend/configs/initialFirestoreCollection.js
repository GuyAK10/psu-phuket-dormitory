const { db } = require('./firebase')
const floors = [
    {
        floor:
        {
            name: "floorA",
            room: ["A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08", "A09", "A10", "A11", "A12", "A13", "A14", "A15", "A16", "A17", "A18", "A19", "A20", "A21", "A22", "A23", "A24"]
        }
    },
    {
        floor:
        {
            name: "floorB",
            room: ["B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B09", "B10", "B11", "B12", "B13", "B14", "B15", "B16", "B17", "B18", "B19", "B20", "B21", "B22", "B23", "B24"]
        }
    },
    {
        floor:
        {
            name: "floorC",
            room: ["C01", "C02", "C03", "C04", "C05", "C06", "C07", "C08", "C09", "C10", "C11", "C12", "C13", "C14", "C15", "C16", "C17", "C18", "C19", "C20", "C21", "C22", "C23", "C24"]
        }
    },
    {
        floor:
        {
            name: "floorD",
            room: ["D01", "D02", "D03", "D04", "D05", "D06", "D07", "D08", "D09", "D10", "D11", "D12", "D13", "D14", "D15", "D16", "D17", "D18", "D19", "D20", "D21", "D22", "D23", "D24"]
        }
    },
    {
        floor:
        {
            name: "floorE",
            room: ["E01", "E02", "E03", "E04", "E05", "E06", "E07", "E08", "E09", "E10", "E11", "E12", "E13", "E14", "E15", "E16", "E17", "E18", "E19", "E20", "E21", "E22", "E23", "E24"]
        }
    },
    {
        floor:
        {
            name: "floorF",
            room: ["F01", "F02", "F03", "F04", "F05", "F06", "F07", "F08", "F09", "F10", "F11", "F12", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24"]
        }
    },
    {
        floor:
        {
            name: "floorG",
            room: ["G01", "G02", "G03", "G04", "G05", "G06", "G07", "G08", "G09", "G10", "G11", "G12", "G13", "G14", "G15", "G16", "G17", "G18", "G19", "G20", "G21", "G22", "G23", "G24"]
        }
    },
    {
        floor:
        {
            name: "floorH",
            room: ["H01", "H02", "H03", "H04", "H05", "H06", "H07", "H08", "H09", "H10", "H11", "H12", "H13", "H14", "H15", "H16", "H17", "H18", "H19", "H20", "H21", "H22", "H23", "H24"]
        }
    }]

const createRoomDb = async () => floors.map(async floorId => {
    const checkFloors = await db.collection(floorId.floor.name).get()
    if (checkFloors.empty) {
        floorId.floor.room.map(async roomName => {
            const addFloor = await db.collection(`${floorId.floor.name}`).doc(`${roomName}`)
            addFloor.set({ status: true })
                .then(result => console.log(`add new floor ${floorId.floor.name} and room ${roomName}`))
        })
    }
})

const checkCheckStatus = async () => {
    const dormStatus = await db.doc(`domitory/status`)
    if (!(await dormStatus.get()).exists) {
        dormStatus.set({ status: true })
    }
}

createRoomDb()
checkCheckStatus()