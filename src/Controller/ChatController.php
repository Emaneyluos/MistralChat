<?php


namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\HttpClient\HttpClientInterface;

// TODO: Add Whisper
// TODO: Add Dall-E
// TODO: Add database for save the discuss
class ChatController extends AbstractController
{
    
    public function __construct(
        private HttpClientInterface $client,
    ) {
    }

    #[Route('/', name: 'my_chat_homepage')]
    public function indexAction(Request $request)
    {
    

    
        return $this->render('chat/index.html.twig');
    }

    
    #[Route('/sendMessage', name: 'my_chat_send_message')]
    public function sendMessageAction(Request $request)
{
    set_time_limit(300);

    // Récupération des données envoyées par la requête AJAX
    $content = $request->getContent();
    $data = json_decode($content, true);
    $text = $data['text'];
    $size = $data['size'];

    if (!$text || !$size) {
        return new JsonResponse(['error' => 'Missing required parameters'], 400);
    }

    $url = 'https://api.mistral.ai/v1/chat/completions';

    // Définissez les données JSON à envoyer
    $data = [
        'model' => 'mistral-' . $size,
        'messages' => [
            ['role' => 'user', 'content' => $text],
        ],
    ];

    // Définissez les en-têtes HTTP
    $headers = [
        'Content-Type' => 'application/json',
        'Accept' => 'application/json',
        'Authorization' => 'Bearer ' .  $_ENV['MISTRAL_API_KEY'],
    ];

    // Créez une instance de Symfony HttpClient

    // Envoyez la requête HTTP POST à l'API Mistral
    $response = $this->client->request('POST', $url, [
        'headers' => $headers,
        'json' => $data,
    ]);

    $content = $response->toArray();
    $message = $content['choices'][0]['message']['content'];
    $message = $content['model'] . ' : ' . $message;
    // $message = json_encode($content, JSON_PRETTY_PRINT);
   

    return new JsonResponse($message,200);
}
}