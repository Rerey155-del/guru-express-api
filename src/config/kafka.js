const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'guru-app',
    brokers: ['localhost:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'announcement-group' });
const admin = kafka.admin();

const connectKafka = async () => {
    await admin.connect();
    // Pastikan topic ada
    const topics = await admin.listTopics();
    if (!topics.includes('announcements')) {
        await admin.createTopics({
            topics: [{ topic: 'announcements', numPartitions: 1 }],
        });
        console.log('Topic "announcements" berhasil dibuat');
    }
    await admin.disconnect();

    await producer.connect();
    console.log('Kafka Producer Terhubung')

    await consumer.connect();
    console.log('Kafka Consumer Terhubung');
};

const runConsumer = async (topic) => {
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const announcement = JSON.parse(message.value.toString());
            console.log(`[Kafka Consumer] Pesan Baru:`, announcement);
        }
    })
}

module.exports = { producer, connectKafka, runConsumer };

